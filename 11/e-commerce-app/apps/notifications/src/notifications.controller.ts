import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  @EventPattern('order_completed')
  handleOrderCompleted(order: any) {
    console.log(
      `📩 Sending notification to ${order.user}: Your order ${order.id} is completed!`,
    );
  }
}
