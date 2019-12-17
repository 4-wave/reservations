import styled from 'styled-components';

export const Wrapper = styled.div`
    padding: 15px;
    border: 1px solid #e4e4e4;
    display: flex;
    flex-flow: column;
    position: absolute;
    margin-top: 280px;
    margin-left: 0px;
    width: 20%;
    background-color: white;
    z-index: 1000;
`;

export const Container = styled.div`
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    padding: 5px;
    margin: 5px;
`;

export const SubContainer = styled.div`
display: flex;
flex-flow: column;
`;

export const Category = styled.div`
font-family: Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif;
font-weight: 400;
font-style: normal;
font-size: 16px;
line-height: 20px;
color: #212121;
`;

export const Age = styled.div`
font-family: Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif;
font-weight: 400;
font-style: normal;
font-size: 12px;
line-height: 16px;
color: #242423;
`;

export const Button = styled.button`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border: 1px solid #717171;
`;

export const CloseButton = styled.button`
font-family: Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif;
border: none;
font-style: normal;
font-weight: 600;
font-size: 16px;
line-height: 22px;
color: #008489;
`;
