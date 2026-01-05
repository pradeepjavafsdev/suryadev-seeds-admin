import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/common/Button";
import { colors } from "../constants/colors";
import { categories } from "../constants/categories";

const seasons = ["KHARIF", "RABI", "NONE"];

interface SelectableBadgeProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const SelectableBadge: React.FC<SelectableBadgeProps> = ({
  label,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.badge, isSelected && { backgroundColor: colors.primary }]}
    onPress={onPress}
  >
    <Text style={[styles.badgeText, isSelected && { color: colors.white }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  category: Yup.string().required("Category is required"),
  bagWeight: Yup.number().required("Bag weight is required").positive(),
  mrp: Yup.number().required("MRP is required").positive(),
  offerPercent: Yup.number()
    .min(0)
    .max(100)
    .required("Offer percent is required"),
  salePrice: Yup.number().required("Sale price is required").positive(),
  germination: Yup.number()
    .min(0)
    .max(100)
    .required("Germination % is required"),
  yieldDuration: Yup.number().required("Yield duration is required").positive(),
  season: Yup.string().required("Season is required"),
  description: Yup.string().required("Description is required"),
});

const AddProductScreen = () => {
  const [image, setImage] = useState<string | null>(null);

  const calculateSalePrice = (mrp: string, offerPercent: string) => {
    const mrpValue = parseFloat(mrp);
    const offerValue = parseFloat(offerPercent);
    if (!isNaN(mrpValue) && !isNaN(offerValue)) {
      return (mrpValue - (mrpValue * offerValue) / 100).toFixed(2);
    }
    return "";
  };

  const calculateOfferPercent = (mrp: string, salePrice: string) => {
    const mrpValue = parseFloat(mrp);
    const salePriceValue = parseFloat(salePrice);
    if (!isNaN(mrpValue) && !isNaN(salePriceValue) && mrpValue > 0) {
      return (((mrpValue - salePriceValue) / mrpValue) * 100).toFixed(2);
    }
    return "";
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = (values: any) => {
    if (!image) {
      Alert.alert("Error", "Please upload a product image");
      return;
    }

    console.log({ ...values, imageUri: image });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>

      <Formik
        initialValues={{
          name: "",
          category: "",
          bagWeight: "",
          mrp: "",
          offerPercent: "0", // Set initial offer percent to 0
          salePrice: "",
          germination: "",
          yieldDuration: "",
          season: "",
          description: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("name")}
                value={values.name}
                placeholder="Enter product name"
              />
              {touched.name && errors.name && (
                <Text style={styles.error}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.badgeContainer}>
                {categories.map((category) => (
                  <SelectableBadge
                    key={category.id}
                    label={category.name}
                    isSelected={values.category === category.id}
                    onPress={() => setFieldValue("category", category.id)}
                  />
                ))}
              </View>
              {touched.category && errors.category && (
                <Text style={styles.error}>{errors.category}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bag Weight (kg)</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("bagWeight")}
                value={values.bagWeight}
                keyboardType="numeric"
                placeholder="Enter bag weight"
              />
              {touched.bagWeight && errors.bagWeight && (
                <Text style={styles.error}>{errors.bagWeight}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>MRP (₹)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => {
                  setFieldValue("mrp", value);
                  setFieldValue("salePrice", value); // Set sale price equal to MRP initially
                  if (value && values.offerPercent) {
                    setFieldValue(
                      "salePrice",
                      calculateSalePrice(value, values.offerPercent)
                    );
                  }
                }}
                value={values.mrp}
                keyboardType="numeric"
                placeholder="Enter MRP"
              />
              {touched.mrp && errors.mrp && (
                <Text style={styles.error}>{errors.mrp}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Offer Percentage (%)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => {
                  setFieldValue("offerPercent", value);
                  if (values.mrp) {
                    setFieldValue(
                      "salePrice",
                      calculateSalePrice(values.mrp, value)
                    );
                  }
                }}
                value={values.offerPercent}
                keyboardType="numeric"
                placeholder="Enter offer percentage"
              />
              {touched.offerPercent && errors.offerPercent && (
                <Text style={styles.error}>{errors.offerPercent}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sale Price (₹)</Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => {
                  setFieldValue("salePrice", value);
                  if (values.mrp) {
                    setFieldValue(
                      "offerPercent",
                      calculateOfferPercent(values.mrp, value)
                    );
                  }
                }}
                value={values.salePrice}
                keyboardType="numeric"
                placeholder="Enter sale price"
              />
              {touched.salePrice && errors.salePrice && (
                <Text style={styles.error}>{errors.salePrice}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Germination (%)</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("germination")}
                value={values.germination}
                keyboardType="numeric"
                placeholder="Enter germination percentage"
              />
              {touched.germination && errors.germination && (
                <Text style={styles.error}>{errors.germination}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Yield Duration (days)</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("yieldDuration")}
                value={values.yieldDuration}
                keyboardType="numeric"
                placeholder="Enter yield duration"
              />
              {touched.yieldDuration && errors.yieldDuration && (
                <Text style={styles.error}>{errors.yieldDuration}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Season</Text>
              <View style={styles.badgeContainer}>
                {seasons.map((season) => (
                  <SelectableBadge
                    key={season}
                    label={season}
                    isSelected={values.season === season}
                    onPress={() => setFieldValue("season", season)}
                  />
                ))}
              </View>
              {touched.season && errors.season && (
                <Text style={styles.error}>{errors.season}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Image</Text>
              <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <Text style={styles.uploadText}>Tap to upload image</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                onChangeText={handleChange("description")}
                value={values.description}
                placeholder="Enter product description"
                multiline
                numberOfLines={4}
              />
              {touched.description && errors.description && (
                <Text style={styles.error}>{errors.description}</Text>
              )}
            </View>

            <Button
              title="Add Product"
              onPress={handleSubmit}
              color={colors.primary}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  imageUpload: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadText: {
    color: "#666",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default AddProductScreen;
