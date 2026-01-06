import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from './firebase';

interface ProductData {
  name: string;
  category: string;
  bagWeight: string;
  mrp: string;
  offerPercent: string;
  salePrice: string;
  germination: string;
  yieldDuration: string;
  season: string;
  description: string;
}

/**
 * Upload image to Firebase Storage
 * @param uri - Local image URI from the device
 * @param folder - Storage folder name (default: 'products')
 * @returns Promise with download URL
 */
export const uploadImage = async (
  uri: string,
  folder: string = 'products'
): Promise<string> => {
  try {
    // Fetch the image from local URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create unique filename
    const filename = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload the file
    await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Add product to Firestore
 * @param productData - Product form data
 * @param imageUri - Local image URI
 * @returns Promise with document ID
 */
export const addProduct = async (
  productData: ProductData,
  imageUri: string
): Promise<string> => {
  try {
    // First upload the image
    const imageUrl = await uploadImage(imageUri);
    
    // Prepare product data for Firestore
    const product = {
      name: productData.name,
      category: productData.category,
      bagWeight: parseFloat(productData.bagWeight),
      mrp: parseFloat(productData.mrp),
      offerPercent: parseFloat(productData.offerPercent),
      salePrice: parseFloat(productData.salePrice),
      germination: parseFloat(productData.germination),
      yieldDuration: parseInt(productData.yieldDuration),
      season: productData.season,
      description: productData.description,
      imageUrl: imageUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true, // Default to active
    };
    console.log('Prepared product data:', product);
    // Add to Firestore 'products' collection
    const productsRef = collection(firestore, 'products');
    const docRef = await addDoc(productsRef, product);
    
    console.log('Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};