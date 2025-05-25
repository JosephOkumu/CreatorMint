
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ipfsService } from '../services/ipfs';

interface NFTMintFormProps {
  onMint: (metadata: { name: string; description: string; image: string }) => Promise<string | void>;
  isConnected: boolean;
}

const NFTMintForm: React.FC<NFTMintFormProps> = ({ onMint, isConnected }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToIPFS = async (file: File, name: string, description: string): Promise<string> => {
    try {
      // Prepare the file for NFT.Storage
      const nftFile = ipfsService.prepareFile(file);
      
      // Upload to IPFS and get metadata URI
      const metadataUri = await ipfsService.uploadNFT({
        name,
        description,
        image: nftFile
      });
      
      return metadataUri;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive"
      });
      return;
    }

    if (!name || !description || !image) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select an image",
        variant: "destructive"
      });
      return;
    }

    setIsMinting(true);
    try {
      // Upload to IPFS and get metadata URI
      const metadataUri = await uploadToIPFS(image, name, description);
      
      // Create metadata object for the contract
      const metadata = {
        name,
        description,
        image: metadataUri
      };

      // Call the parent's onMint function (which will call the contract)
      const result = await onMint(metadata);
      
      // Reset form
      setName('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      
      // Prepare success message
      let successMessage = "Your NFT has been successfully minted and you've earned Creator Tokens!";
      
      // Add transaction hash if available
      if (typeof result === 'string') {
        successMessage += ` Transaction: ${result.slice(0, 10)}...`;
      }
      
      toast({
        title: "NFT Minted!",
        description: successMessage
      });
    } catch (error) {
      console.error('Minting error:', error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="glass-effect p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <ImageIcon className="h-6 w-6 mr-2" />
        Create NFT
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-white">NFT Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter NFT name"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-white">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your NFT"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="image" className="text-white">Upload Image</Label>
          <div className="mt-2">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Label
              htmlFor="image"
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-colors"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-white/60 mb-2" />
                  <span className="text-white/60">Click to upload image</span>
                </>
              )}
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isConnected || isMinting}
          className="w-full bg-gradient-to-r from-crypto-purple to-crypto-pink hover:from-crypto-violet hover:to-crypto-purple text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {isMinting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Minting NFT...
            </>
          ) : (
            'Mint NFT'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default NFTMintForm;
