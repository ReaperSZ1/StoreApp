
const API_TOKEN = "2830bb796b6dc49b3ff5a7e64c87de";
const API_URL = "https://site-api.datocms.com/items";
 const json = '{"data":{"allProducts":[{"title":"bola quadrada","description":"a original by quico","img":{"id":"D-Ax2bGXTNK5AnEcQp9ZtQ"}},{"title":"carro de brinquedo","description":"um carro de brinquedo muito foda menor ","img":{"id":"T_vyLbrVRPGFbFSojz7rEg"}}]}}'
 const obj = JSON.parse(json)
console.log(JSON.stringify(json, 2, 0))
const postData = {
  data: {
    type: "item",
    attributes: {
      title: "Meu Primeiro Post via API",
      content: "Esse é um post criado via código!",
    },
    relationships: {
      item_type: {
        data: { type: "item_type", id: "SEU_MODEL_ID" }
      }
    }
  }
  data: {
    allProducts: [
      {
        title: "bola quadrada",
        description: "a original by quico",
        img: {
          id: "D-Ax2bGXTNK5AnEcQp9ZtQ"
        }
      },
      {
        title: "carro de brinquedo",
        description: "um carro de brinquedo muito foda menor",
        img: {
          id: "T_vyLbrVRPGFbFSojz7rEg"
        }
      }
    ]
  }
};

fetch(API_URL, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(postData)
})
  .then(response => response.json())
  .then(data => console.log("Post criado:", data))
  .catch(error => console.error("Erro ao criar post:", error));
