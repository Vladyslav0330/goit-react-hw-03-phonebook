import { nanoid } from 'nanoid';
import { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('contacts'));
    if (contacts) {
      this.setState({ contacts: contacts });
    }
  }

  componentDidUpdate(prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  handleAddContact = newContact => {
    if (this.handleCheckName(newContact.name)) {
      alert(`${newContact.name} is already in contacts.`);
      return false;
    }
    this.setState(({ contacts }) => ({
      contacts: [...contacts, { ...newContact, id: nanoid() }],
    }));
    return true;
  };

  handleFilterChange = filter => this.setState({ filter });
  getContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLocaleLowerCase())
    );
  };

  handleCheckName = name => {
    const { contacts } = this.state;
    const isExistContact = contacts.some(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );
    return isExistContact;
  };

  handleRemoveContact = id =>
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== id),
    }));

  render() {
    const { filter, contacts } = this.state;
    const filterContacts = this.getContacts();
    // const add = contacts.length > 0;
    return (
      <div className="form">
        <h2>Phonebook</h2>
        <ContactForm onAdd={this.handleAddContact} />
        <h2>Contacts</h2>
        <Filter filter={filter} onChange={this.handleFilterChange} />
        {contacts.length > 0 && (
          <ContactList
            contacts={filterContacts}
            onRemove={this.handleRemoveContact}
          />
        )}
      </div>
    );
  }
}
