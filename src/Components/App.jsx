import React from 'react'
import { ajax } from 'jQuery';
import Price from './Price.jsx';
import Calendar from './Calendar.jsx';
import { Wrapper, Button } from './styles/App.js'
import Form from './Form.jsx';
import Guests from './Guests.jsx';
import GuestsAdd from './GuestsAdd.jsx';
import TotalPrice from './TotalPrice.jsx';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pricePerNight: '',
            cleaningFees: '',
            serviceFees: '',
            average_rating: 0,
            number_of_reviews: 0, 
            isClicked: false,
            id: 0,
            guestsClicked: false,
            adults: 1,
            children: 0,
            infants:0,
            dayStart: 0,
            dayEnd: 0,
            month: '',
            year: ''
        }
        this.onDayClick = this.onDayClick.bind(this);
        this.changeToVisible = this.changeToVisible.bind(this);
        this.changeGuestsVisible = this.changeGuestsVisible.bind(this);
        this.changeCountAdults = this.changeCountAdults.bind(this);
        this.changeCountChildren = this.changeCountChildren.bind(this);
        this.changeCountInfants = this.changeCountInfants.bind(this);
        this.getClickedYearAndMonth = this.getClickedYearAndMonth.bind(this);
        this.convertertDate = this.convertertDate.bind(this);
    }

    componentDidMount() {
        this.getListing();
    }

    changeCountAdults(value) {
        this.setState({ adults: value})
    }

    changeCountChildren(value) {
        this.setState({ children: value})
    }

    changeCountInfants(value) {
        this.setState({ infants: value})
    }

    onDayClick(e, day) {
        if (this.state.dayStart === 0){
            this.setState({dayStart: day})
        } else if (this.state.dayStart !== 0
                &&  this.state.dayEnd === 0) {
                this.setState({dayEnd: day})    
        } else {
        }
    }

    getClickedYearAndMonth(month, year) {
        month = month.toLowerCase();
        let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        month = months.indexOf(month) + 1;
        this.setState({ month: month, year: year })
    }

    getListing() {
        const endpoint = window.location.pathname;
        let url = '';
        if (endpoint.length === 1) {
          url = '/houses/1';
        } else {
          const arr = endpoint.split('/');
          const id = arr[arr.length - 2];
          url = `/houses/${id}`;
        }
        let arrayUrl = url.split('/');
        var id = Number(arrayUrl[arrayUrl.length - 1])
        ajax({
            type: "GET",
            url: url ,
            success: (data) => {
                this.setState({pricePerNight: data[0].price_per_night,
                     cleaningFees: data[0].cleaning_fees,
                    serviceFees: data[0].service_fees,
                    average_rating: data[0].average_rating,
                    number_of_reviews: data[0].number_of_reviews,
                     id: id})
            }, 
            error: (message) => {
                console.log(message);
            }
        })
      }

      changeToVisible() {
          this.state.isClicked === false ?
        this.setState({isClicked: true}) : 
        this.setState({isClicked: false})
      }
      changeGuestsVisible() {
        this.state.guestsClicked === false ?
      this.setState({guestsClicked: true}) : 
      this.setState({guestsClicked: false})
    }

    convertertDate(day, month, year) {
        return `${day}/${month}/${year}`
    }
    
    render() {
        return (
            <Wrapper>
               <Price pricePerNight={this.state.pricePerNight} 
               averageRating={this.state.average_rating}
               numberOfReviews={this.state.number_of_reviews}/>
               <Form changeVisibility={this.changeToVisible} checkIn={this.convertertDate(this.state.dayStart, this.state.month, this.state.year)} checkOut={this.convertertDate(this.state.dayEnd, this.state.month, this.state.year)}/>
               {this.state.isClicked ?
               <Calendar getYearAndMonth={this.getClickedYearAndMonth} onDayClick={(e, day) => {
                this.onDayClick(e, day)
            }} id={this.state.id}/> : <div></div>}
                <Guests adults={this.state.adults} children={this.state.children} infants={this.state.infants} changeVisibility={this.changeGuestsVisible}/>
                {this.state.guestsClicked ?
                <GuestsAdd countAdults={this.changeCountAdults} countChildren={this.changeCountChildren} countInfants={this.changeCountInfants}/> : <div></div>}
                {this.state.dayEnd !== 0 ?
                <TotalPrice pricePerNight={this.state.pricePerNight} cleaningFees={this.state.cleaningFees} serviceFees={this.state.serviceFees} start={this.state.dayStart} end={this.state.dayEnd}/> : 
            <div></div> }
                <Button>Reserve</Button>
                </Wrapper>
        )
    }
}

export default App;