export async function setTurn(board) {
  try {
    const response = await fetch("http://localhost:4000/api/ai-tac-toe", {
      method: "POST",
      body: JSON.stringify({board}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    return { error: "Error al conectar con la API." };
  }
}
