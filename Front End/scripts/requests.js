const apiAddress = "http://localhost:3000/tasks";

//-----------------GET REQUESTS----------------
export async function getJSON(endpoint = "") {
  try {
    const url = `${apiAddress}/${endpoint}`;
    const request = await fetch(url);
    if (!request.ok) {
      window.location.href = "../htmlContent/NotFound.html";
    }
    const response = await request.json();
    return response;
  } catch {
    window.location.href = "../htmlContent/NotFound.html";
  }
}

//-----------------PATCH REQUESTS----------------
export async function updateJSON(method, bodyObject) {
  if (method === "PATCH") {
    //PATCH REQUESTS
    try {
      const request = await fetch(apiAddress, {
        method: method,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(bodyObject),
      });
      await request.json();
    } catch {
      window.location.href = "../htmlContent/NotFound.html";
    }
  } else if (method === "DELETE") {
    //DELETE REQUESTS
    try {
      const response = await fetch(
        `http://localhost:3000/tasks/${bodyObject}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        window.location.href = "../htmlContent/NotFound.html";
      }
    } catch {
      window.location.href = "../htmlContent/NotFound.html";
    }
  }
}
