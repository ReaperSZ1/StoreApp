const url = 'https://graphql.datocms.com'; // URL da API GraphQL
const headers = {
  'Authorization': '2830bb796b6dc49b3ff5a7e64c87de', // Substitua com o seu token de API
  'Content-Type': 'application/json'
};

const query = `
  query {
  allProducts {
    title
    description
    img {
      id
    }
  }
}
`;

fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({ query }) // A query vai aqui como um objeto JSON
})
  .then(response => response.json()) // Converte a resposta em JSON
  .then(data => console.log(JSON.stringify(data))) // Aqui você lida com a resposta da API
  .catch(error => console.error('Erro:', error)); // Caso haja erro
