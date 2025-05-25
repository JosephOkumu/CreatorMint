import { NFTStorage, File } from 'nft.storage';

// Get API key from environment variables
const NFT_STORAGE_API_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY || '';

// NFT Metadata interface
export interface NFTMetadata {
  name: string;
  description: string;
  image: File;
}

class IPFSService {
  private client: NFTStorage;

  constructor() {
    this.client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
  }

  /**
   * Upload image to IPFS and create NFT metadata
   * @param {File} image - Image file to upload
   * @param {string} name - NFT name
   * @param {string} description - NFT description
   * @returns {Promise<string>} - IPFS URI for the metadata
   */
  public async uploadNFT(metadata: NFTMetadata): Promise<string> {
    try {
      // Check if API key is provided
      if (!NFT_STORAGE_API_KEY) {
        console.warn('NFT.Storage API key not provided, using simulated IPFS URI');
        return `ipfs://QmSimulatedHash${Date.now()}`;
      }

      // Upload to IPFS
      const result = await this.client.store({
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      });

      return result.url;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  /**
   * Convert a regular file to NFT.Storage File object
   * @param {File} file - Regular file
   * @returns {File} - NFT.Storage File
   */
  public prepareFile(file: File): File {
    return new File([file], file.name, { type: file.type });
  }

  /**
   * Get IPFS gateway URL from an IPFS URI
   * @param {string} ipfsUri - IPFS URI (ipfs://...)
   * @returns {string} - HTTP URL for the IPFS content
   */
  public getGatewayUrl(ipfsUri: string): string {
    if (!ipfsUri) return '';
    return ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
}

// Create and export an instance of the service
export const ipfsService = new IPFSService();
export default ipfsService;
