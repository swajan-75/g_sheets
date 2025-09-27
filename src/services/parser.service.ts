export interface BkashTransaction {
  number: string;
  amount: string;
  trxId: string;
  date: string;
  time: string;
  reference: string;
  balance: string;
}

export function parseBkashMessage(msg: string): BkashTransaction | null {
  const regex =
    /received Tk ([0-9.]+) from (\d+)\.Ref (.*?)\. Fee Tk [0-9.]+\. Balance Tk ([0-9.,]+)\. TrxID (\w+) at (\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/;

  const match = msg.match(regex);
  if (!match) return null;

  return {
    amount: match[1],
    number: match[2],
    reference: match[3],
    balance: match[4],
    trxId: match[5],
    date: match[6],
    time: match[7],
  };
}
