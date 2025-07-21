import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { OrderCreateMessage } from '@app/shared/messages';

@Injectable()
export class ApiService {
  constructor(@Inject('RabbitMQ') private readonly client: ClientProxy) {}

  async createOrder(payload: any) {
    const order = {
      id: Date.now(),
      product: payload.product,
      quantity: payload.quantity,
      user: 'john@example.com',
    };

    console.log('⌛ Order Received:', order);

    this.client.emit('order_created', order);

    return 'Ok!';
  }
}
