import styled from 'styled-components';

export const Wrapper = styled.div`
    position: absolute;
    margin-top: 170px;
    margin-right: 100px;
    background-color: white;
    border: 1px solid #e4e4e4;
    z-index: 2;
`;

export const CalendarTable = styled.table`
    padding: 1em;
    display: flex;
    flex-flow: column;
`;

export const CalendarHeader = styled.div`
display: flex;
flex-flow: row;
justify-content: space-between;
`;

export const WeekDayContainer = styled.div`
display: flex;
flex-flow: row;
font-family: Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif;
font-style: normal;
font-weight: 600;
font-size: 12px;
line-height: 17px;


color: #757575;
`;

export const Cells = styled.div`
display: flex;
flex-flow: column;

`;

export const Day = styled.td`
padding: 2px;
`;

export const Row = styled.div`
display: flex;
flex-flow: row;
`;

export const Number = styled.span`
padding: 4px;
`;

export const WeekDay = styled.div`
padding: 4px;
color: #484848;
font-family: Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif;
font-style: normal;
font-weight: 700;
font-size: 12px;
line-height: 12px;
`;
