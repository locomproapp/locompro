
import React from 'react';
import DetailsCard from './DetailsCard';

interface BuyRequestInformationProps {
  buyRequest: any;
  buyRequestData: any;
}

const BuyRequestInformation = ({ buyRequest, buyRequestData }: BuyRequestInformationProps) => {
  return <DetailsCard buyRequest={buyRequest} buyRequestData={buyRequestData} />;
};

export default BuyRequestInformation;
