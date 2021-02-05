import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth'
import 'dotenv/config';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session'
import { insertSeedData } from './seed-data';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 30,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: { 
    fields: ['name', 'email', 'password'] ,
    // todo add initial roles
  }  
})

export default withAuth(config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: process.env.DATABASE_URL,
    async onConnect(keystone) {
      if (process.argv.includes('--seed-data')) {
        await insertSeedData(keystone);
      }      
    }
  },
  lists: createSchema({
    User,
    Product,
    ProductImage
  }),
  ui: {
    // show the ui only for people who pass this test
    isAccessAllowed: ({session}) => {
      return !!session?.data;
    },
  },
  session: withItemData(statelessSessions(sessionConfig), {
    User: 'id name email'
  })
}));
