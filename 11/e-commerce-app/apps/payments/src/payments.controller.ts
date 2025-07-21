import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller()
export class PaymentsController {
  constructor(@Inject('RabbitMQ') private readonly client: ClientProxy) {}

  @EventPattern('order_processing')
  handleOrderProcessing(order: any) {
    console.log('💰 Payment Processing:', order);

    setTimeout(() => {
      this.client.emit('order_completed', order);
    }, 1000);
  }
}
