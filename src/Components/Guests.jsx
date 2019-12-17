import React from 'react'
import { Wrapper, Form, GuestCount, DropDown} from './styles/Guests.js'

class Guests extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            adults: this.props.adults,
            children: this.props.children,
            infants: this.props.infants
        }
    }

    componentDidUpdate() {
        const {adults, children, infants} = this.state;
        if (adults !== this.props.adults || children !== this.props.children || infants !== this.props.infants) {
            this.setState({adults: this.props.adults, children: this.props.children, infants: this.props.infants})
        } 
    }

    render() {
        const { adults, children, infants } = this.state;
        return(
           <Wrapper>
                Guests:
            <Form onClick={this.props.changeVisibility}>
        <GuestCount> {adults + children} {adults + children === 1 
        ? "guest" : "guests"}{infants === 0 ? '' : `, ${infants} ${infants === 1 
            ? "infant" : "infants"}`}</GuestCount><DropDown><svg transform="scale(0.70)" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"/></svg></DropDown>
            </Form>
            </Wrapper>  
        )
    }
} 

export default Guests;