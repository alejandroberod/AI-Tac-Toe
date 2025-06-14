export async function setTurn(board) {
  const response = await fetch("http://localhost:4000/api/ai-tac-toe", {
    method: "POST",
    body: JSON.stringify({board}),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const resData = response.json();
  return resData;
}

export async function aiTurn() {
  const response = await fetch("http://localhost:4000/api/ai-tac-toe/thinking");
  const resData = response.json();
  return resData;
}