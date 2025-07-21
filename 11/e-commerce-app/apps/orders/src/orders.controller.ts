import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { OrderCreateMessage } from '@app/shared/messages';

@Controller()
export class OrdersController {
  constructor(@Inject('RabbitMQ') private readonly client: ClientProxy) {}

  @EventPattern('order_created')
  handleOrderCreated(order: OrderCreateMessage) {
    console.log('📦 Order Processing:', order);

    setTimeout(() => {
      this.client.emit('order_processing', order);
    }, 1000);
  }
}
