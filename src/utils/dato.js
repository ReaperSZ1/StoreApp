// utils/dato.js
const API_URL = "https://graphql.datocms.com/";
const API_TOKEN = "3fe2bbeef4b29e5444a911555d3ca8";

const query = `
  query {
    allProducts {
        id
        title
        slug
        description
        price
        onsale
        category { title }
        img { url }
        _createdAt
    }
  }
`;


export async function buscarProdutos() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error("❌ Erros ao buscar produtos:", result.errors);
      return [];
    } else {
      return result.data.allProducts;
    }
  } catch (error) {
    console.error("❌ Erro de rede:", error.message);
    return [];
  }
}
