import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { Query, Message, Person, MutationResponse, PersonMutationResponse, MessageMutationResponse } from './types';
import { GraphQLError, DocumentNode } from 'graphql';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QUERY_PEOPLE_AND_MESSAGES, CREATE_PERSON_MUTATION, CREATE_MESSAGE_MUTATION } from './queries';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Agent } from 'http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  messages: Message[];
  people: Person[];
  loading = true;

  messagesTableColumns: string[] = ['id', 'description'];
  peopleTableColumns: string[] = ['id', 'name', 'age'];
  peopleForm: FormGroup;
  messagesForm: FormGroup;

  private querySubcription: Subscription;
  private createPersonMutationSubcscription: Subscription;
  private createMessageMutationSubcscription: Subscription;

  constructor(private apollo: Apollo, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.peopleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      age: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(3)]]
    });

    this.messagesForm = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    });


    this.querySubcription = this.apollo
      .watchQuery({
        query: QUERY_PEOPLE_AND_MESSAGES,
        errorPolicy: 'all',
        fetchResults: true

      })
      .valueChanges.subscribe((result: ApolloQueryResult<Query>) => {
        this.messages = result.data && result.data.messages;
        this.people = result.data && result.data.people;
        this.loading = result.loading;
        console.log('Graphql errors', result.errors);
      }, (error: HttpErrorResponse) => {
        console.log('there was an error sending the query', error.message);
      }
      );

  }

  addPerson(): void {
    this.createPersonMutationSubcscription = this.apollo.mutate({
      mutation: CREATE_PERSON_MUTATION,
      variables: {
        name: this.peopleForm.get('name').value,
        age: this.peopleForm.get('age').value
      }
    }).subscribe((result: MutationResponse) => {
      const person: PersonMutationResponse = result.data.createPerson;
      this.people = [...this.people, { id: person.id, name: person.name, age: person.age }];
    }, (error: HttpErrorResponse) => {
      console.log('there was an error sending the mutation', error);
    });
  }

  addMessage(): void {
    this.createMessageMutationSubcscription = this.apollo.mutate({
      mutation: CREATE_MESSAGE_MUTATION,
      variables: {
        description: this.messagesForm.get('description').value,
      }
    }).subscribe((result: MutationResponse) => {
      const message: MessageMutationResponse = result.data.createMessage;
      this.messages = [...this.messages, { id: message.id, description: message.description }];
    }, (error: HttpErrorResponse) => {
      console.log('there was an error sending the mutation', error);
    });
  }

  ngOnDestroy(): void {
    this.querySubcription.unsubscribe();
    this.createPersonMutationSubcscription.unsubscribe();
    this.createMessageMutationSubcscription.unsubscribe();
  }
}
