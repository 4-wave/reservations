import React from 'react';
import { Wrapper, Container, SubContainer, Category, Age, Button, CloseButton } from './styles/GuestsAdd.js'

class GuestsAdd extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            adultsCount: this.props.adults,
            childrenCount: this.props.children,
            infantsCount: this.props.infants
        }
        this.adultsCountUp = this.adultsCountUp.bind(this);
        this.childrenCountUp = this.childrenCountUp.bind(this);
        this.infantsCountUp = this.infantsCountUp.bind(this);
        this.adultsCountDown = this.adultsCountDown.bind(this);
        this.childrenCountDown = this.childrenCountDown.bind(this);
        this.infantsCountDown = this.infantsCountDown.bind(this);
    }

    adultsCountUp() {
        let adultsCount = this.state.adultsCount + 1;
        this.props.countAdults(adultsCount)
        this.setState({adultsCount: adultsCount})
    }

    childrenCountUp() {
        let childrenCount = this.state.childrenCount + 1;
        this.props.countChildren(childrenCount)
        this.setState({childrenCount: childrenCount})
    }

    infantsCountUp() {
        let infantsCount = this.state.infantsCount + 1;
        this.props.countInfants(infantsCount)
        this.setState({infantsCount: infantsCount})
    }

    adultsCountDown() {
        let adultsCount = this.state.adultsCount - 1;
        this.props.countAdults(adultsCount)
        this.setState({adultsCount: adultsCount})
    }

    childrenCountDown() {
        let childrenCount = this.state.childrenCount - 1;
        this.props.countChildren(childrenCount)
        this.setState({childrenCount: childrenCount})
    }

    infantsCountDown() {
        let infantsCount = this.state.infantsCount - 1;
        this.props.countInfants(infantsCount)
        this.setState({infantsCount: infantsCount})
    }

    render(){
        return(
           <Wrapper>
        <Container><SubContainer><Category>Adults</Category></SubContainer><div><Button onClick={this.adultsCountDown} disabled={this.state.adultsCount === 1}> - </Button>  {this.state.adultsCount}  <Button onClick={this.adultsCountUp} disabled={this.state.adultsCount + this.state.childrenCount === 4}> + </Button></div></Container>
        <Container><SubContainer><Category>Children</Category><Age>Ages 2-12</Age></SubContainer><div><Button onClick={this.childrenCountDown} disabled={this.state.childrenCount === 0}> - </Button>  {this.state.childrenCount}  <Button onClick={this.childrenCountUp} disabled={this.state.adultsCount + this.state.childrenCount === 4}> + </Button></div></Container>
        <Container><SubContainer><Category>Infants</Category><Age>Under 2</Age></SubContainer><div><Button onClick={this.infantsCountDown} disabled={this.state.infantsCount === 0}> - </Button>  {this.state.infantsCount}  <Button onClick={this.infantsCountUp} disabled={this.state.infantsCount === 5}> + </Button></div></Container>
        <Container><Age>4 guests maximum. Infants don’t count toward the number of guests.</Age></Container> 
        <CloseButton onClick={() =>{this.props.close(this.state.adultsCount, this.state.childrenCount, this.state.infantsCount)}}>Close</CloseButton>
            </Wrapper>
        )
    }
}

export default GuestsAdd;