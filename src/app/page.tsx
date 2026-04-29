/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore, Ad, PrescriptionRequest, User } from '../store/useStore';
import { moderateAd } from '../services/moderateService';
import { supabase } from '../services/supabase';
import { MOCK_ADS, MOCK_PRESCRIPTION_REQUESTS } from '../data/mockData';

// Components
import { Navigation } from '../components/Navigation';
import { LoginView } from '../components/LoginView';
import { TabHome } from '../components/TabHome';
import { TabSearch } from '../components/TabSearch';
import { TabSolidarity } from '../components/TabSolidarity';
import { TabNewAd } from '../components/TabNewAd';
import { TabChat } from '../components/TabChat';
import { TabProfile } from '../components/TabProfile';
import { ModalAdDetail } from '../components/ModalAdDetail';
import { ModalPrescriptionDetail } from '../components/ModalPrescriptionDetail';
import { ModalNewRequestForm } from '../components/ModalNewRequestForm';
import { ModalScanner } from '../components/ModalScanner';
import { ModalQRCode } from '../components/ModalQRCode';
import { ModalRating } from '../components/ModalRating';
import { ModalReport } from '../components/ModalReport';
import { MapOverlay } from '../components/MapOverlay';

type Tab = 'home' | 'search' | 'solidarity' | 'new' | 'chat' | 'profile';

export default function App() {
  const { 
    user, login, isAuthenticated, ads, setAds, completeAd, 
    prescriptionRequests, addPrescriptionRequest, adoptPrescriptionRequest, completePrescriptionRequest 
  } = useStore();

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PrescriptionRequest | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleAuthUser(session.user);
      }
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleAuthUser(session.user);
      } else {
        useStore.getState().logout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (supabaseUser: any) => {
    const newUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
      city: 'São Paulo', // Mock until we have profile setup
      state: 'SP',
      neighborhood: 'Centro',
      description: 'Membro da rede Óculos Solidários',
      photoUrl: supabaseUser.user_metadata?.avatar_url || '',
      rating: 5,
      totalRatings: 1
    };
    login(newUser);
    
    // Fetch Data from DB
    const { data: adsData } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
    if (adsData) {
      const fetchedAds: Ad[] = adsData.map(d => ({
        id: d.id,
        userId: d.user_id,
        title: d.title,
        description: d.description,
        type: d.type,
        condition: d.condition,
        frameStyle: d.frame_style,
        targetAudience: d.target_audience,
        prescriptionSummary: d.prescription_summary,
        lensDetails: d.lens_details,
        city: d.city,
        state: d.state,
        neighborhood: d.neighborhood,
        status: d.status,
        photoUrl: d.photo_urls[0],
        photoUrls: d.photo_urls,
        createdAt: new Date(d.created_at).getTime(),
      }));
      setAds(fetchedAds);
    }

    const { data: reqData } = await supabase.from('prescription_requests').select('*').order('created_at', { ascending: false });
    if (reqData) {
      useStore.getState().prescriptionRequests.forEach(r => useStore.getState().completePrescriptionRequest(r.id)); // Clear current requests if any
      reqData.forEach(d => {
        useStore.getState().addPrescriptionRequest({
          id: d.id,
          userId: d.user_id,
          patientName: d.patient_name,
          description: d.description,
          prescriptionPhotoUrl: d.prescription_photo_url,
          documentPhotoUrl: d.document_photo_url,
          prescriptionSummary: d.prescription_summary,
          status: d.status,
          donorId: d.donor_id,
          city: d.city,
          state: d.state,
          neighborhood: d.neighborhood,
          createdAt: new Date(d.created_at).getTime(),
        });
      });
    }
  };

  // Modals visibility
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showRequestQRModal, setShowRequestQRModal] = useState(false);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Form states
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [isModerating, setIsModerating] = useState(false);

  const [activeChat, setActiveChat] = useState<any | null>(null);

  const [newRequest, setNewRequest] = useState({
    patientName: '',
    description: '',
    prescriptionSummary: '',
  });

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    type: 'donation' as 'donation' | 'exchange',
    frameStyle: '',
    targetAudience: 'adult' as 'adult' | 'child' | 'unisex',
    prescriptionSummary: '',
    photoUrls: [] as string[],
    photoFiles: [] as File[],
  });

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleCreateAd = async () => {
    if (!newAd.title || !newAd.description || !user) return;
    
    setIsModerating(true);
    const result = await moderateAd(newAd.title, newAd.description);

    if (result.status === 'blocked') {
      setIsModerating(false);
      alert(`Anúncio bloqueado: ${result.reason}`);
      return;
    }

    // 1. Upload images
    const uploadedUrls: string[] = [];
    for (const file of newAd.photoFiles || []) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('public-glasses')
        .upload(fileName, file);
      
      if (!error && data) {
        const { data: publicData } = supabase.storage.from('public-glasses').getPublicUrl(data.path);
        uploadedUrls.push(publicData.publicUrl);
      }
    }

    const finalPhotoUrls = [...newAd.photoUrls, ...uploadedUrls];
    if (finalPhotoUrls.length === 0) {
       // fallback if no photo uploaded
       finalPhotoUrls.push('https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1887&auto=format&fit=crop');
    }

    // 2. Insert into DB
    const { data: adData, error: insertError } = await supabase.from('ads').insert({
      user_id: user.id,
      title: newAd.title,
      description: newAd.description,
      type: newAd.type,
      condition: 'Bom',
      frame_style: newAd.frameStyle || 'Não especificado',
      target_audience: newAd.targetAudience,
      prescription_summary: newAd.prescriptionSummary,
      lens_details: '',
      city: user.city || '',
      state: user.state || '',
      neighborhood: user.neighborhood || '',
      status: result.status === 'review' ? 'review' : 'active',
      photo_urls: finalPhotoUrls
    }).select().single();

    setIsModerating(false);

    if (insertError) {
      alert(`Erro ao criar anúncio: ${insertError.message}`);
      return;
    }

    // 3. Update local store
    const ad: Ad = {
      id: adData.id,
      userId: adData.user_id,
      title: adData.title,
      description: adData.description,
      type: adData.type,
      condition: adData.condition,
      frameStyle: adData.frame_style,
      targetAudience: adData.target_audience,
      prescriptionSummary: adData.prescription_summary,
      lensDetails: adData.lens_details,
      city: adData.city,
      state: adData.state,
      neighborhood: adData.neighborhood,
      status: adData.status,
      photoUrl: adData.photo_urls[0],
      photoUrls: adData.photo_urls,
      createdAt: new Date(adData.created_at).getTime(),
    };

    setAds([ad, ...ads]);
    setNewAd({
      title: '',
      description: '',
      type: 'donation',
      frameStyle: '',
      targetAudience: 'adult',
      prescriptionSummary: '',
      photoUrls: [],
      photoFiles: [],
    });
    
    if (result.status === 'review') {
      alert('Anúncio enviado para revisão da moderação.');
    } else {
      alert('Anúncio publicado com sucesso!');
    }
    
    setActiveTab('home');
  };

  const handleCreateRequest = () => {
    const request: PrescriptionRequest = {
      id: crypto.randomUUID(),
      userId: user?.id || 'anon',
      patientName: newRequest.patientName,
      description: newRequest.description,
      prescriptionSummary: newRequest.prescriptionSummary,
      prescriptionPhotoUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
      documentPhotoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1000&auto=format&fit=crop',
      status: 'pending',
      city: user?.city || '',
      state: user?.state || '',
      neighborhood: user?.neighborhood || '',
      createdAt: Date.now(),
    };

    addPrescriptionRequest(request);
    setShowNewRequestForm(false);
    setNewRequest({ patientName: '', description: '', prescriptionSummary: '' });
    alert('Seu pedido de ajuda foi enviado com sucesso!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <TabHome 
          user={user} 
          ads={ads} 
          onSelectAd={(ad) => { setSelectedAd(ad); setActivePhotoIndex(0); }} 
          onOpenNotifications={() => {}} 
          onOpenMap={() => setShowMap(true)} 
        />;
      case 'search':
        return <TabSearch onGoToSolidarity={() => setActiveTab('solidarity')} />;
      case 'solidarity':
        return <TabSolidarity 
          prescriptionRequests={prescriptionRequests} 
          onSelectRequest={setSelectedRequest} 
          onOpenNewRequestForm={() => setShowNewRequestForm(true)} 
        />;
      case 'new':
        return <TabNewAd 
          newAd={newAd} 
          setNewAd={setNewAd} 
          isModerating={isModerating} 
          onCreateAd={handleCreateAd} 
        />;
      case 'chat':
        return <TabChat onSelectChat={setActiveChat} />;
      case 'profile':
        return <TabProfile 
          user={user} 
          ads={ads} 
          onOpenScanner={() => setShowScannerModal(true)} 
          onOpenMyAds={() => {}} 
          onOpenModeration={() => {}} 
          onGoToChat={() => setActiveTab('chat')} 
          onOpenSettings={() => {}} 
          onLogout={() => useStore.getState().logout()} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center bg-slate-200 min-h-screen">
      <div className="w-full max-w-md bg-slate-50 relative min-h-screen shadow-2xl flex flex-col font-sans overflow-hidden">
        
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Overlays & Modals */}
        <AnimatePresence>
          {selectedAd && (
            <ModalAdDetail 
              ad={selectedAd} 
              onClose={() => setSelectedAd(null)}
              activePhotoIndex={activePhotoIndex}
              setActivePhotoIndex={setActivePhotoIndex}
              onGenerateQRCode={() => setShowQRCodeModal(true)}
              onCompleteAd={(id) => { completeAd(id); setShowRatingModal(true); setSelectedAd(null); }}
              onManifestInterest={(ad) => { setActiveChat({ name: `Doador #${ad.userId.slice(-3)}` }); setSelectedAd(null); setActiveTab('chat'); }}
            />
          )}

          {selectedRequest && (
            <ModalPrescriptionDetail 
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              user={user}
              onAdopt={(id, uid) => { adoptPrescriptionRequest(id, uid); alert('Você adotou este pedido! Entre em contato com o paciente.'); }}
              onShowQR={() => setShowRequestQRModal(true)}
            />
          )}
        </AnimatePresence>

        <MapOverlay 
          show={showMap} 
          onClose={() => setShowMap(false)} 
          ads={ads} 
          onSelectAd={(ad) => { setSelectedAd(ad); setShowMap(false); }} 
        />

        <ModalScanner 
          show={showScannerModal} 
          onClose={() => setShowScannerModal(false)}
          ads={ads}
          prescriptionRequests={prescriptionRequests}
          onCompleteAd={completeAd}
          onCompletePrescription={completePrescriptionRequest}
        />

        <ModalNewRequestForm 
          show={showNewRequestForm}
          onClose={() => setShowNewRequestForm(false)}
          newRequest={newRequest}
          setNewRequest={setNewRequest}
          onSubmit={handleCreateRequest}
        />

        <ModalQRCode 
          show={showQRCodeModal && !!selectedAd}
          onClose={() => setShowQRCodeModal(false)}
          value={selectedAd?.id || ''}
          title="QR Code de Retirada"
          description="Mostre este código para o doador no momento da entrega."
        />

        <ModalQRCode 
          show={showRequestQRModal && !!selectedRequest}
          onClose={() => setShowRequestQRModal(false)}
          value={selectedRequest?.id || ''}
          title="QR Code de Recebimento"
          description="Mostre este código para o padrinho no momento em que receber os óculos."
        />

        <ModalRating 
          show={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          rating={ratingValue}
          setRating={setRatingValue}
          comment={ratingComment}
          setComment={setRatingComment}
          onSubmit={() => { alert('Obrigado pela avaliação!'); setShowRatingModal(false); }}
        />

        <ModalReport 
          show={showReportModal}
          onClose={() => setShowReportModal(false)}
          reason={reportReason}
          setReason={setReportReason}
          onSubmit={() => { alert('Denúncia enviada!'); setShowReportModal(false); }}
        />

      </div>
    </div>
  );
}
