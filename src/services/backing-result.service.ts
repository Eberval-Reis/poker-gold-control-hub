
import { supabase } from "@/lib/supabase";

/**
 * Salva resultado de backing e os pagamentos dos backers.
 * @param {Object} params
 * @param {string} backingOfferId
 * @param {number} prizeAmount
 * @param {string} resultType
 */
export async function saveBackingResult({ backingOfferId, prizeAmount, netPrize, playerProfit, resultType }: {
  backingOfferId: string,
  prizeAmount: number,
  netPrize: number,
  playerProfit: number,
  resultType: string
}) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  // Salva resultado
  const { data: result, error: resultError } = await supabase
    .from("backing_results")
    .insert([{
      backing_offer_id: backingOfferId,
      prize_amount: prizeAmount,
      net_prize: netPrize,
      player_profit: playerProfit,
      result_type: resultType,
      user_id: user.id
    }])
    .select()
    .single();

  if (resultError) throw resultError;

  // Busca todos os investimentos desse backing_offer
  const { data: investments, error: investError } = await supabase
    .from("backing_investments")
    .select("*")
    .eq("backing_offer_id", backingOfferId)
    .eq("user_id", user.id);

  if (investError) throw investError;

  // Calcula payout de cada backer proporcional à sua porcentagem no net_prize
  const payouts = (investments || []).map((investment) => ({
    backing_investment_id: investment.id,
    backing_result_id: result.id,
    payout_amount: (netPrize * (Number(investment.percentage_bought) / 100)),
    roi_percentage: netPrize > 0 && investment.amount_paid > 0
      ? ((netPrize * (Number(investment.percentage_bought) / 100)) / Number(investment.amount_paid)) * 100
      : 0,
    payment_status: "pending",
    user_id: user.id
  }));

  if (payouts.length > 0) {
    const { error: payoutError } = await supabase
      .from("backer_payouts")
      .insert(payouts);

    if (payoutError) throw payoutError;
  }

  return result;
}
