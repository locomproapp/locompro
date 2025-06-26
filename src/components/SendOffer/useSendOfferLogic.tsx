
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useBuyRequestDetail } from '@/hooks/useBuyRequestDetail';
import { useOfferData } from './hooks/useOfferData';
import { useOfferSubmission } from './hooks/useOfferSubmission';
import { SendOfferFormData } from './SendOfferForm';

export const useSendOfferLogic = () => {
  const { id: buyRequestId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const editOfferId = searchParams.get('edit');
  const { user } = useAuth();

  console.log('🔍 SendOffer - URL buyRequestId:', buyRequestId);
  console.log('🔍 SendOffer - editOfferId:', editOfferId);

  // Load offer data if editing
  const { isCounterOffer, actualBuyRequestId, initialFormValues } = useOfferData(editOfferId);

  // Get the buy request data
  const { data: buyRequest, isLoading: buyRequestLoading } = useBuyRequestDetail(actualBuyRequestId || buyRequestId || '');

  // Handle offer submission
  const { submitOffer } = useOfferSubmission();

  const handleSubmit = async (values: SendOfferFormData) => {
    const targetBuyRequestId = actualBuyRequestId || buyRequestId;
    if (targetBuyRequestId) {
      await submitOffer(values, targetBuyRequestId, isCounterOffer, editOfferId);
    }
  };

  return {
    user,
    buyRequest,
    buyRequestLoading,
    isCounterOffer,
    editOfferId,
    actualBuyRequestId,
    buyRequestId,
    initialFormValues,
    handleSubmit
  };
};
