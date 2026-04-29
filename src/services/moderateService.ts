export async function moderateAd(title: string, description: string) {
  try {
    const response = await fetch("/api/moderate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error("Failed to moderate content");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na moderação:", error);
    return { status: "review", reason: "Erro ao processar moderação automática." };
  }
}
