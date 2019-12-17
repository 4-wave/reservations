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
            infants: 0,
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
        this.closeGuestsAndGetCount = this.closeGuestsAndGetCount.bind(this);
    }

    componentDidMount() {
        this.getListing();
    }

    changeCountAdults(value) {
        this.setState({ adults: value })
    }

    changeCountChildren(value) {
        this.setState({ children: value })
    }

    changeCountInfants(value) {
        this.setState({ infants: value })
    }

    onDayClick(e, day) {
        if (this.state.dayStart === 0) {
            this.setState({ dayStart: day })
        } else if (this.state.dayStart !== 0
            && this.state.dayEnd === 0) {
            this.setState({ dayEnd: day })
        } else {
        }
    }

    getClickedYearAndMonth(month, year) {
        month = month.toLowerCase();
        let months = ["january", "february", "march", "april", "may", "june", "july", "august",
            "september", "october", "november", "december"];
        month = months.indexOf(month) + 1;
        this.setState({ month: month, year: year })
    }

    getListing() {
        const endpoint = window.location.pathname;
        let url = '';
        if (endpoint.length === 1) {
            url = 'http://3.135.103.1/houses/1';
        } else {
            const arr = endpoint.split('/');
            const id = arr[arr.length - 2];
            url = `http://3.135.103.1/houses/${id}`;
        }
        let arrayUrl = url.split('/');
        var id = Number(arrayUrl[arrayUrl.length - 1])
        ajax({
            type: "GET",
            url: url,
            success: (data) => {
                this.setState({
                    pricePerNight: data[0].price_per_night,
                    cleaningFees: data[0].cleaning_fees,
                    serviceFees: data[0].service_fees,
                    average_rating: data[0].average_rating,
                    number_of_reviews: data[0].number_of_reviews,
                    id: id,
                })
            },
            error: (message) => {
                console.log(message);
            }
        })
    }

    changeToVisible() {
        this.state.isClicked === false ?
            this.setState({ isClicked: true }) :
            this.setState({ isClicked: false })
    }

    changeGuestsVisible() {
        this.state.guestsClicked === false ?
            this.setState({ guestsClicked: true }) :
            this.setState({ guestsClicked: false })
    }

    convertertDate(day, month, year) {
        return `${day}/${month}/${year}`
    }

    closeGuestsAndGetCount(adults, children, infants) {
        this.setState({guestsClicked: false, adults:adults, children:children, infants:infants})
    }

    render() {
        const { pricePerNight, average_rating, number_of_reviews, dayStart, dayEnd, year, month, isClicked,
            id, adults, children, infants, guestsClicked, cleaningFees, serviceFees } = this.state
        return (
            <Wrapper>
                <Price pricePerNight={pricePerNight}
                    averageRating={average_rating}
                    numberOfReviews={number_of_reviews} />
                <Form changeVisibility={this.changeToVisible}
                    checkIn={this.convertertDate(dayStart, month, year)}
                    checkOut={this.convertertDate(dayEnd, month, year)} />
                {isClicked ?
                    <Calendar start={dayStart} end={dayEnd}
                        getYearAndMonth={this.getClickedYearAndMonth} id={this.state.id}
                        onDayClick={(e, day) => { this.onDayClick(e, day) }} id={id} /> : <div></div>}
                <Guests adults={adults}
                    children={children}
                    infants={infants}
                    changeVisibility={this.changeGuestsVisible} />
                {guestsClicked ?
                    <GuestsAdd close={this.closeGuestsAndGetCount} countAdults={this.changeCountAdults}
                        countChildren={this.changeCountChildren}
                        countInfants={this.changeCountInfants} adults={adults} children={children} infants={infants}/> : <div></div>}
                {dayEnd !== 0 ?
                    <TotalPrice pricePerNight={pricePerNight}
                        cleaningFees={cleaningFees}
                        serviceFees={serviceFees}
                        start={dayStart}
                        end={dayEnd} /> :
                    <div></div>}
                <Button>Reserve</Button>
            </Wrapper>
        )
    }
}

export default App;