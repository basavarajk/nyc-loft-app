// eslint-disable
// this is an auto generated file. This will be overwritten

export const getPet = `query GetPet($id: ID!) {
  getPet(id: $id) {
    id
    clientId
    name
    description
  }
}
`;
export const listPets = `query ListPets($filter: ModelPetFilterInput, $limit: Int, $nextToken: String) {
  listPets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      clientId
      name
      description
    }
    nextToken
  }
}
`;
