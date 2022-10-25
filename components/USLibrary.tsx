import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import PendingTX from "./PendingTX";

type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP
}

const USLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const usElectionContract = useUSElectionContract(contractAddress);
  const [currentLeader, setCurrentLeader] = useState<string>('Unknown');
  const [name, setName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [bidenSeats, setBidenSeats] = useState<number | undefined>()
  const [trumpSeats, setTrumpSeats] = useState<number | undefined>()
  const [electionStatus, setElectionStatus] = useState<boolean | undefined>()
  const [txStatus, setTxStatus] = useState<any | undefined>({ hash: '', status: false });

  useEffect(() => {
    getCurrentLeader();
    getVotes();
    getElection();
  },[])

  const getCurrentLeader = async () => {
    const currentLeader = await usElectionContract.currentLeader();
    setCurrentLeader(currentLeader == Leader.UNKNOWN ? 'Unknown' : currentLeader == Leader.BIDEN ? 'Biden' : 'Trump')
  }

  const getVotes = async () => {
    const bidenSeats = await usElectionContract.seats(Leader.BIDEN);
    setBidenSeats(bidenSeats);
    const trumpSeats = await usElectionContract.seats(Leader.TRUMP);
    setTrumpSeats(trumpSeats);
  }

  const getElection = async () => {
    const electionStatus = await usElectionContract.electionEnded();
    setElectionStatus(electionStatus);
  }

  const stateInput = (input) => {
    setName(input.target.value)
  }

  const bideVotesInput = (input) => {
    setVotesBiden(input.target.value)
  }

  const trumpVotesInput = (input) => {
    setVotesTrump(input.target.value)
  }

  const seatsInput = (input) => {
    setStateSeats(input.target.value)
  }

  const submitStateResults = async () => {
    const result:any = [name, votesBiden, votesTrump, stateSeats];
    try {
      const tx = await usElectionContract.submitStateResult(result);
      console.log('pending', tx.hash)
      setTxStatus({hash: tx.hash, status: true});
      await tx.wait();
      console.log('finished', tx.hash)
      setTxStatus({hash: tx.hash, status: false});
      getVotes();
      resetForm();
    } catch (error) {
      console.log(error.error.message);
    }
    
  }

  const endElection = async () => {
    const tx = await usElectionContract.endElection();
    console.log('ending election', tx.hash)
    setTxStatus({hash: tx.hash, status: true});
    await tx.wait();
    setTxStatus({hash: tx.hash, status: false});
    getElection();
    console.log('election ended', tx.hash)
  }

  const resetForm = async () => {
    setName('');
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  }

  return (
    <div className="results-form">
      <PendingTX tx={txStatus} />
    <p>
      Current Leader is: {currentLeader}
    </p>
    <p>
      Trump seats { trumpSeats } won <br/>
      Biden seats { bidenSeats } won
    </p>
    <p>{ electionStatus ? "Election ENDED" : "Election on going" }</p>
    <form>
      <label>
        State:
        <input onChange={stateInput} value={name} type="text" name="state" />
      </label>
      <label>
        BIDEN Votes:
        <input onChange={bideVotesInput} value={votesBiden} type="number" name="biden_votes" />
      </label>
      <label>
        TRUMP Votes:
        <input onChange={trumpVotesInput} value={votesTrump} type="number" name="trump_votes" />
      </label>
      <label>
        Seats:
        <input onChange={seatsInput} value={stateSeats} type="number" name="seats" />
      </label>
      {/* <input type="submit" value="Submit" /> */}
    </form>
    <div className="button-wrapper">
      <button onClick={submitStateResults}>Submit Results</button>
    </div>
    <div className="button-wrapper">
      <button onClick={endElection}>End election</button>
    </div>
    <style jsx>{`
        .results-form {
          display: flex;
          flex-direction: column;
        }

        .button-wrapper {
          margin: 20px;
        }
        
      `}</style>
    </div>
  );
};

export default USLibrary;
