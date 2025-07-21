## **📌 Microservices Architecture Overview**
System follows an **event-driven microservices architecture** using **RabbitMQ as a message broker**. Each service 
publishes events and subscribes to specific message queues.

## Docker & Docker compose setup

Running the System
To start the entire microservices system:

```shell
docker-compose up --build
```

To stop all services:

```shell
docker-compose down
```

---

## **📊 Event-Driven Flow**
| **Step** | **Event** | **Publisher** | **Exchange** | **Routing Key** | **Queue** | **Subscriber** |
|----------|----------|--------------|--------------|----------------|-----------|--------------|
| 1️⃣ | `order_created` | API Gateway | `orders_exchange` | `order.created` | `orders_queue` | Order Service |
| 2️⃣ | `order_processed` | Order Service | `payments_exchange` | `order.processed` | `payments_queue` | Payment Service |
| 3️⃣ | `payment_successful` | Payment Service | `notifications_exchange` | `payment.successful` | `notifications_queue` | Notification Service |

---

## **🛠 Microservices Breakdown**
| **Microservice** | **Role** | **Sends Messages To** | **Listens To** |
|-----------------|----------|----------------------|---------------|
| **API Gateway** | Handles HTTP requests and starts order process | `orders_exchange` (Publishes `order_created`) | - |
| **Order Service** | Processes new orders and sends them for payment | `payments_exchange` (Publishes `order_processed`) | `orders_queue` (Receives `order_created`) |
| **Payment Service** | Simulates payment processing | `notifications_exchange` (Publishes `payment_successful`) | `payments_queue` (Receives `order_processed`) |
| **Notification Service** | Sends email/SMS notifications to users | - | `notifications_queue` (Receives `payment_successful`) |

---

## **🎯 RabbitMQ Exchange & Queue Mapping**
| **Exchange Name** | **Type** | **Routing Key** | **Queue** | **Bound Service** |
|------------------|---------|----------------|-----------|----------------|
| `orders_exchange` | `direct` | `order.created` | `orders_queue` | Order Service |
| `payments_exchange` | `direct` | `order.processed` | `payments_queue` | Payment Service |
| `notifications_exchange` | `direct` | `payment.successful` | `notifications_queue` | Notification Service |

---

## **🔄 Full Message Flow**
1️⃣ **API Gateway** receives `POST /orders`, validates it, and emits `order_created` → **(`orders_exchange`, `order.created`)**  
2️⃣ **Order Service** listens for `order_created`, processes it, and emits `order_processed` → **(`payments_exchange`, `order.processed`)**  
3️⃣ **Payment Service** listens for `order_processed`, simulates payment, and emits `payment_successful` → **(`notifications_exchange`, `payment.successful`)**  
4️⃣ **Notification Service** listens for `payment_successful` and sends user confirmation

