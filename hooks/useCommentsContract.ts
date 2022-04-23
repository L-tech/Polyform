import * as wagmi from "wagmi";
import { useProvider, useSigner } from "wagmi";
import type { BigNumber } from "ethers";
// Import our contract ABI (a json representation of our contract's public interface).
// The hardhat compiler writes this file to artifacts during compilation.
import CommentsContract from "./Comments.json";

export interface Comment {
  id: string;
  topic: string;
  message: string;
  creator_address: string;
  created_at: BigNumber;
}

export enum EventType {
  CommentAdded = "CommentAdded",
}

const useCommentsContract = () => {
  const [signer] = useSigner();
  const provider = useProvider();

  const contract = wagmi.useContract({
    addressOrName: "0xAc4118c89E354B46f6C9bD5C4Ede197676a33D96",
    contractInterface: CommentsContract.abi,
    signerOrProvider: signer.data || provider,
  });

  // Wrapper to add types to our getComments function.
  const getComments = async (topic: string): Promise<Comment[]> => {
    return contract.getComments(topic).then((comments) => {
      return comments.map((c) => ({ ...c }));
    });
  };

  // Wrapper to add types to our addComment function.
  const addComment = async (topic: string, message: string): Promise<void> => {
    // Create a new transaction
    const tx = await contract.addComment(topic, message);
    // Wait for transaction to be mined
    await tx.wait();
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getComments,
    addComment,
  };
};

export default useCommentsContract;