import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';


class Cards extends React.Component {

  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.filterCards = this.filterCards.bind(this);
    this.state = {
      cards: [],
      categories: [],
      filterCards: [],
    };
  }

  componentDidMount() {
    axios.get('/api/cards')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ cards: res.data.data, filterCards: res.data.data });
        }
      });

    axios.get('/api/categories')
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ categories: res.data.data, loading: false });
        }
      })
      .catch((error) => console.log(error));
  }

  onSearchChange(e) {
    this.setState({ filterCards: this.filterCards(e.target.value) });
  }

  onSelectChange(e) {
    this.setState({ filterCards: this.selectFilterCards(e.target.value) });
  }

  filterCards(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? this.state.cards : this.state.cards.filter((card) => {
      if (typeof(card.title) === 'string'
        && card.title.toString().toLowerCase().search(inputValue) > -1)
      {
        return true;
      }
      return false;
    });
  }

  selectFilterCards(cat) {
    if (cat === '') return this.state.cards;
    return this.state.cards.filter((card) => card.categories.includes(cat));
  }

  render() {
    return (
      <div>
        <h1>Cards</h1>
        <form>
          <select name="category" onChange={this.onSelectChange}>
            <option value="">Filter by Category:</option>
            {this.state.categories.map((cat) =>
              <option value={cat.slug}>{cat.title}</option>
            )}
          </select>
        </form>
        <ul className="cards-list">
          {this.state.filterCards.map((card) =>
            <li key={card.slug}>
              <Link to={`/cards/${card.slug}`}>{card.title}</Link>
              <span className="metadata">
                {card.categories.map((cat) =>
                  <Link to={`/categories/${cat}`}>{cat}</Link>
                )}
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

Cards.propTypes = {};

Cards.defaultProps = {};

export default Cards;