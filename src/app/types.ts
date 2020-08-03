export type Person = {
  id: number;
  name: string;
  age: number;
};

export type Message = {
  id: number;
  description: string;
};

export type Query = {
  messages?: Message[];
  people?: Person[]
};

export type Mutation = {
  createMessage: Message;
  createPerson: Person;
};

export type PersonMutationResponse = {
  id?: number;
  name?: string;
  age?: number;
};

export type MessageMutationResponse = {
  id?: number;
  description?: string;
};

export type MutationResponse = {
  data: {
    createPerson?: PersonMutationResponse;
    createMessage?: MessageMutationResponse;
  }
};


