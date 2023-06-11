interface SeedStore {
  name: string;
  description: string;
  slug: string;
}

// interface SeedProduct {
//   code: string;
//   description: string;
//   images: string[];
//   stock: number;
//   price: number;
//   sizes: ValidSizes[];
//   slug: string;
//   tags: string[];
//   title: string;
//   type: ValidTypes;
//   gender: 'men' | 'women' | 'kid' | 'unisex';
// }

// type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
// type ValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';

interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
}

interface SeedData {
  users: SeedUser[];
  //products: SeedProduct[];
  stores: SeedStore[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'sebasilvac88@gmail.com',
      password: 'Abc123',
      fullName: 'Sebastián Silva',
      roles: ['user', 'admin', 'superadmin'],
    },
  ],
  stores: [
    {
      name: 'Tesla Store',
      description: 'Tesla Store',
      slug: 'tesla_store',
    },
  ],
};
