import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*');

    const localURL = 'http://localhost:3333/uploads/';
    const mobileURL = 'http://192.168.0.112:3333/uploads/';
    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: mobileURL + item.image,
      };
    });

    return response.json(serializedItems);
  }
}

export default ItemsController;
