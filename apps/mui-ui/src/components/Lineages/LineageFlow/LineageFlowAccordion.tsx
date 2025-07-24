/* eslint-disable @typescript-eslint/no-unused-vars */
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

export const LineageFlowCustomAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#fff9f8',
  border: '1px solid #ddd',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  color: '#fff',
  justifyContent: 'space-between',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '8px 0',
  },
}));

export const LineageFlowCustomAccordionSummary = styled(AccordionSummary)(
  ({ theme }) => ({
    backgroundColor: '#fff9f8',
    borderRadius: '8px',
    width: '100%',
    '&.Mui-expanded': {
      borderBottom: '1px solid #ddd',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    '& .MuiAccordionSummary-content': {
      margin: '12px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
);

export const LineageFlowCustomAccordionDetails = styled(AccordionDetails)({
  backgroundColor: '#fff',
  padding: '0',
});
