import { User, Ad, PrescriptionRequest } from '../store/useStore';

export const MOCK_USER: User = {
  id: 'user1',
  name: 'Ana Silva',
  email: 'ana@email.com',
  city: 'São Paulo',
  neighborhood: 'Vila Mariana',
  state: 'SP',
  description: 'Gostaria de ajudar quem precisa. Tenho alguns óculos que não uso mais.',
  rating: 4.8,
  totalRatings: 12
};

export const MOCK_ADS: Ad[] = [
  {
    id: 'ad1',
    userId: 'user2',
    title: 'Óculos de Grau Masculino 2.5',
    description: 'Armação resistente, pouco usada.',
    type: 'donation',
    condition: 'Excelente',
    frameStyle: 'Retangular',
    targetAudience: 'adult',
    prescriptionSummary: '+2.5 OD, +2.5 OE',
    lensDetails: 'Anti-reflexo',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Moema',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511499767390-903390e6f24a?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510103525167-27ea22f28122?q=80&w=2070&auto=format&fit=crop'
    ],
    createdAt: Date.now(),
  },
  {
    id: 'ad2',
    userId: 'user3',
    title: 'Armação Infantil Rosa',
    description: 'Troco por armação azul ou doação.',
    type: 'exchange',
    condition: 'Bom',
    frameStyle: 'Redonda',
    targetAudience: 'child',
    prescriptionSummary: '-1.0 OD, -1.0 OE',
    lensDetails: 'Policarbonato',
    city: 'Curitiba',
    state: 'PR',
    neighborhood: 'Centro',
    status: 'active',
    photoUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1740&auto=format&fit=crop',
    photoUrls: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=1740&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509198305018-ba205c742724?q=80&w=2070&auto=format&fit=crop'
    ],
    createdAt: Date.now() - 86400000,
  }
];

export const MOCK_PRESCRIPTION_REQUESTS: PrescriptionRequest[] = [
  {
    id: 'req1',
    userId: 'user4',
    patientName: 'Joãozinho Santos',
    description: 'Joãozinho tem 7 anos e está com dificuldades na escola por não enxergar bem. A família não tem condições de comprar os óculos novos.',
    prescriptionPhotoUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop',
    documentPhotoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=80&w=1000&auto=format&fit=crop',
    prescriptionSummary: 'Miopia -2.5 em ambos os olhos',
    status: 'pending',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Grajaú',
    createdAt: Date.now() - 172800000,
  }
];
