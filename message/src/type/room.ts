interface Room {
    id: string;
    seller: User;
    buyer: User;
    productId: string;
    lastMessage?: LastMessage;
  }