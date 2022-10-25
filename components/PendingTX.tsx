import { useWeb3React } from "@web3-react/core";
import { formatEtherscanLink } from "../util";

type PendingTXProps = {
  tx: any;
};

const PendingTX = ({tx} : PendingTXProps) => {
  const { chainId } = useWeb3React();

  return (
    <div>
      { tx.status && (
        <div>
          <p>TX is pending</p>
          <p>
          <a
          {...{
            href: formatEtherscanLink("Transaction", [chainId, tx.hash]),
            target: "_blank",
            rel: "noopener noreferrer",
          }}
          >
            {tx.hash}
          </a>
          </p>
        </div>
      ) }
    </div>
  );
};

export default PendingTX;
