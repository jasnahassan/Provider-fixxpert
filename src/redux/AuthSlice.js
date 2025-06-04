import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL = 'http://65.1.185.205:5000/api/';

// Google Login API Call

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async ({ token, google_client_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}provider/login_google`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, google_client_id }),
      });

      const data = await response.json();
      const statusCode = response.status;

      if(data.token){
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      }
     
      return { ...data, statusCode };
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Something went wrong!' });
    }
  }
);

// export const loginWithGoogle = createAsyncThunk(
//   'auth/loginWithGoogle',
//   async ({ token, google_client_id }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${BASE_URL}provider/login_google`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token, google_client_id }),
//       });

//       const data = await response.json();
//       const statusCode = response.status;
//             // Save token in AsyncStorage
//       await AsyncStorage.setItem('authToken', data.token);
//       await AsyncStorage.setItem('userData', JSON.stringify(data.user));

//       console.log('Google Login Response:', data);
//       console.log('Response Status Code:', statusCode);

//       return { ...data, statusCode }; // always return status code with data

//     } catch (error) {
//       console.error("Google Login Error:", error);
//       return rejectWithValue(error.message || 'Something went wrong!');
//     }
//   }
// );

// export const loginWithGoogle = createAsyncThunk(
//   'auth/loginWithGoogle',
//   async ({ token, google_client_id }, { rejectWithValue }) => {
//     try {

//       console.log(token, google_client_id,'here got ?')
//       const response = await fetch(`${BASE_URL}provider/login_google`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           token,
//           google_client_id,
//         }),
//       });

//       const data = await response.json();
//       console.log("Google Login Response:", data);

//       if (!response.ok || !data.token) {
//         throw new Error(data.message || 'Google login failed');
//       }

//       const statusCode = response.status;
//       console.log('Response Status Code:', statusCode)

//       if (statusCode === 200 || statusCode === 201) {
//         return data; // Return the response data if successful
//       } else {
//         throw new Error(data?.error);
//       }

//       // Save token in AsyncStorage
//       await AsyncStorage.setItem('authToken', data.token);
//       await AsyncStorage.setItem('userData', JSON.stringify(data.user));

//       return data;
//     } catch (error) {
//       console.error("Google Login Error:", error);
//       return rejectWithValue(error.message || 'Something went wrong!');
//     }
//   }
// );

// Update FCM Token API Call
export const updateFcmToken = createAsyncThunk(
  'auth/updateFcmToken',
  async ({ token }, { rejectWithValue }) => {
    try {
      const tokenauth = await AsyncStorage.getItem('authToken');
      console.log("Retrieved Auth Token:", tokenauth);

      const requestBody = {
        token: token
      };

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': tokenauth ? `Bearer ${tokenauth}` : '',
      };

      // 🔍 Log the full request info
      console.log("Request Headers:", headers);
      console.log("Request Body:", requestBody);

      const response = await fetch(`${BASE_URL}provider/update_fcm_token`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody), // ✅ Must stringify JSON body
      });

      const data = await response.json();
      console.log("FCM Token Update Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update FCM token');
      }

      return data;
    } catch (error) {
      console.error("FCM Token Update Error:", error);
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);


// Verify OTP API Call
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobileNumber, otp }, { rejectWithValue }) => {
    console.log(mobileNumber, otp, 'Verifying OTP');

    try {
      const response = await fetch(`${BASE_URL}verify-otp`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobileNumber, otp }),
      });

      const data = await response.json();
      console.log(data, 'Verify OTP Response');

      if (!data.status) {
        throw new Error(data.message || 'OTP verification failed');
      }

      return data; // Return full response data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

// Resend OTP API Call
export const resendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ mobileNumber }, { rejectWithValue }) => {
    console.log(mobileNumber, 'jhhh')
    try {
      const response = await fetch(`${BASE_URL}resend-otp`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();
      console.log(data, 'otp respo')

      if (!data.status) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data.response.data.id; // Returns mobileNumber ID if OTP is sent successfully
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

// Send OTP API Call
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ mobileNumber }, { rejectWithValue }) => {
    console.log(mobileNumber, 'jhhh')
    try {
      const response = await fetch(`${BASE_URL}send-otp`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();
      console.log(data, 'otp respo')

      if (!data.status) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data.response.data.id; // Returns mobileNumber ID if OTP is sent successfully
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

// Register API Call
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Request Body:', userData); // Log the full request body

      const response = await fetch(`${BASE_URL}provider/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Use the full data here
      });

      const data = await response.json();
      console.log('Registration Response:', data); // Log the API response

      if (!response.ok) {
        throw new Error(data?.error || 'Registration failed. Try again!');
      }

      return data; // Success response
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, reset_code, new_password }, { rejectWithValue }) => {
    try {
      
      const response = await fetch(`${BASE_URL}provider/reset_password`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({   email,
          reset_code,
          new_password, }),
      });


      const data = await response.json();
      console.log(data, 'logindata emaill')

      const statusCode = response.status;
      console.log('Response Status Code:', statusCode); 
      

      if (statusCode === 200 || statusCode === 201) {
        return data; // Return the response data if successful
      } else {
        throw new Error(data?.error);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

// forgotPassword API Call
export const forgotPassword = createAsyncThunk(
  'auth/loginUser',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}provider/forgot_password`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data, 'logindata emaill')

      const statusCode = response.status;

      console.log('Response Status Code:', statusCode); 

      if (statusCode === 200 || statusCode === 201) {
        return data; // Return the response data if successful
      }
      else {
        throw new Error(data.error || 'Password reset failed');
      }

    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);


// Login API Call
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}provider/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data, 'logindata')

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token to AsyncStorage
      await AsyncStorage.setItem('authToken', data.token);

      // Optionally, you can save other user data like email, mobile, etc.
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }

  
);

// New: Fetch All Service Types API Call
export const fetchAllServiceTypes = createAsyncThunk(
  'auth/fetchAllServiceTypes',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}service_type/fetch_all`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      const data = await response.json();
      console.log(data, 'Service Types Response');
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch service types');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);
// Fetch Service Type by ID API Call
export const fetchServiceTypeById = createAsyncThunk(
  'auth/fetchServiceTypeById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}service_type/fetch/${serviceId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log('Fetched Service Type Details:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch service type details');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const createBooking = createAsyncThunk(
  'auth/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      // ✅ Log the data being sent
      console.log('Booking Data Sent:', bookingData);

      const response = await fetch('http://65.1.185.205:5000/api/booking/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log('Create Booking Response:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Booking failed. Try again!');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);



export const createAddress = createAsyncThunk(
  'auth/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}address/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          city: addressData?.cityId, // You will pass cityId from UI
          address_line1: addressData?.title, // Main Title
          address_line2: addressData?.detail, // More Info
        }),
      });

      const data = await response.json();
      console.log('Create Address Response:', data);

      // if (!response.ok) {
      //   throw new Error(data.message || 'Address creation failed');
      // }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while creating address!');
    }
  }
);


// Adjust your import if needed

export const fetchAllAddresses = createAsyncThunk(
  'auth/fetchAllAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}address/fetch`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log('Fetch Addresses Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch addresses');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while fetching addresses!');
    }
  }
);

export const fetchBanners = createAsyncThunk(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken'); // ✅ get token

      const response = await fetch(`${BASE_URL}banner/fetch`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', // ✅ pass token in header
        },
      });

      const data = await response.json();
      console.log("Banner API response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch banners');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const uploadBookingImages = createAsyncThunk(
  'auth/uploadBookingImages',
  async ({ booking_id, booking_images }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('booking_id', booking_id);

      console.log('🖼️ Preparing to upload images:', booking_images.map(img => img.uri));

      booking_images.forEach((image, index) => {
        if (image?.uri) {
          console.log(`📤 Appending Image #${index + 1}:`, image.uri);
          formData.append('booking_image', {
            uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
            type: image.type || 'image/jpeg',
            name: image.fileName || `photo_${index}.jpg`,
          });
        } else {
          console.warn(`⚠️ Skipping image #${index + 1} due to missing data`);
        }
      });

      const response = await fetch(`${BASE_URL}booking_image/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          // ⚠️ Don't set 'Content-Type' manually when using FormData
        },
        body: formData,
      });

      const data = await response.json();
      console.log('✅ Image Upload API Response:', data);

      if (!response.ok || data?.error) {
        throw new Error(data.message || data.error || 'Failed to upload images');
      }

      return data;
    } catch (error) {
      console.error('❌ Image Upload Error:', error);
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({
    user_id,
    name,
    profile_image_file_id, 
  }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const body = {
        name,
        profile_image_file_id,
      
      };

      console.log('Sending body:', JSON.stringify(body, null, 2));

      const response = await fetch(`${BASE_URL}provider/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Profile update failed');
      }

      return data;
    } catch (error) {
      console.error('Error in updateUserProfile:', error.message);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// export const updateUserProfile = createAsyncThunk(
//   'auth/updateUserProfile',
//   async ({ user_id,
//     name,
//     profile_picture, }, { rejectWithValue }) => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       const formData = new FormData();

//       formData.append('name', name);
//       console.log('Sending Name:', name, user_id);

//       if (profile_picture) {
//         const filename = profile_picture.split('/').pop();
//         const fileType = filename.split('.').pop();

//         const imageData = {
//           uri: Platform.OS === 'android' ? profile_picture : profile_picture.replace('file://', ''),
//           type: `image/${fileType}`,
//           name: filename,
//         };

//         console.log('Sending ProfilePic:', imageData);

//         formData.append('profile_picture', imageData);
//       }

//       console.log('FormData:', formData); // You can't directly log FormData, but we can still observe inputs above

//       const response = await fetch(`${BASE_URL}provider/update/${user_id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       console.log('Response from server:', data);

//       if (!response.ok) {
//         throw new Error(data?.error || 'Profile update failed');
//       }

//       return data;
//     } catch (error) {
//       console.error('Error in updateUserProfile:', error.message);
//       return rejectWithValue(error.message || 'Something went wrong');
//     }
//   }
// );

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (user_id, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Using token:', token, user_id);

      const response = await fetch(`${BASE_URL}provider/fetch/${user_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetched Profile Data:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error.message);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, new_password }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}provider/change_password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password,
          new_password,
        }),
      });

      const data = await response.json();
      console.log('Change Password Response:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Password change failed');
      }

      return data;
    } catch (error) {
      console.error('Error in changePassword:', error.message);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
export const fetchNotifications = createAsyncThunk(
  'auth/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Fetching notifications with token:', token);

      const response = await fetch(`${BASE_URL}fcm/fetch_all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetched Notifications:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch notifications');
      }

      return data;
    } catch (error) {
      console.error('Error in fetchNotifications:', error.message);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);
export const fetchBookings = createAsyncThunk(
  'auth/fetchBookings',
  async ({ booking_status = '' }, { rejectWithValue }) => {
    try {
      console.log(booking_status,'here status')
      const token = await AsyncStorage.getItem('authToken');
      const url = `${BASE_URL}booking/fetch?booking_status=${booking_status}&search_query=`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      console.log(data, 'bpooking list')

      if (!response.ok) throw new Error(data?.error || 'Failed to fetch bookings');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCities = createAsyncThunk(
  'auth/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}city/fetch_all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      console.log(data,'city data ')

      if (!response.ok) throw new Error(data?.error || 'Failed to fetch cities');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateBookingstatus = createAsyncThunk(
  'booking/cancelBooking',
  async ({ bookingId,booking_status }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}booking/update_status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include if your API is protected
        },
        body: JSON.stringify({ booking_status: booking_status }),
      });

      const data = await response.json();
      console.log('booking response:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Cancel booking failed');
      }

      return data;
    } catch (error) {
      console.error('Error in cancelBooking:', error.message);
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
)

export const rescheduleBooking = createAsyncThunk(
  'auth/rescheduleBooking',
  async ({ bookingId, bookingData }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      console.log('Rescheduling Booking ID:', bookingId);
      console.log('Reschedule Data Sent:', bookingData);

      const response = await fetch(`${BASE_URL}booking/update/${bookingId}`, {
        method: 'PUT', // Use 'POST' if the API requires it for update
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      console.log('Reschedule Booking Response:', data);

      if (!response.ok) {
        throw new Error(data?.error || 'Reschedule failed. Try again!');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'user/deleteProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Deleting user with ID:', userId);

      const response = await fetch(`${BASE_URL}provider/deactivate/${userId}`, {
        // method: 'DELETE',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log('Delete Profile Response:', data);

      // Check for successful response
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete profile');
      }

      return data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while deleting the profile!');
    }
  }
);

export const uploadProviderDocuments = createAsyncThunk(
  'auth/uploadProviderDocuments',
  async ({ provider_id, documents }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('provider_id', provider_id);

      console.log('📄 Uploading provider documents:', documents.map(doc => doc.uri));

      documents.forEach((doc, index) => {
        if (doc?.uri) {
          formData.append('documents', {
            uri: Platform.OS === 'android' ? doc.uri : doc.uri.replace('file://', ''),
            type: doc.type || 'application/pdf', // or 'image/jpeg' if it's an image
            name: doc.name || `document_${index}.pdf`,
          });
        } else {
          console.warn(`⚠️ Skipping document #${index + 1} due to missing data`);
        }
      });

      const response = await fetch(`${BASE_URL}provider/document/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      });

      const data = await response.json();
      console.log('✅ Document Upload Response:', data);

      if (!response.ok || data?.error) {
        throw new Error(data.message || data.error || 'Failed to upload documents');
      }

      return data;
    } catch (error) {
      console.error('❌ Document Upload Error:', error);
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

// bankSlice.js or wherever you manage bank details
export const createBankDetails = createAsyncThunk(
  'bank/createBankDetails',
  async ({ bank_name, account_holder_name, account_number, ifsc_code, provider_id }, { rejectWithValue }) => {
    console.log('Creating bank details:', bank_name, account_holder_name, account_number, ifsc_code,provider_id);

    try {

      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}bank/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          bank_name,
          account_holder_name,
          account_number,
          ifsc_code,
          provider_id, // if required
        }),
      });

      const data = await response.json();
      console.log(data, 'Bank Details Response');

      if (!data.status) {
        throw new Error(data.message || 'Failed to create bank details');
      }

      return data; // Or data.result, based on your API
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const sendServiceProviderLocation = createAsyncThunk(
  'location/sendServiceProviderLocation',
  async ({ service_provider_id, lat, long }, { rejectWithValue }) => {
    console.log({ service_provider_id, lat, long }, 'Sending location...');
   
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}service_provider_location/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
           'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ service_provider_id, lat, long }),
      });

      const data = await response.json();
      console.log(data, 'location response');

      if (!data.status) {
        throw new Error(data.message || 'Failed to send location');
      }

      return data.response;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const fetchProviderDashboard = createAsyncThunk(
  'dashboard/fetchProviderDashboard',
  async (providerId, { rejectWithValue }) => {
    try {
      console.log(providerId,'provider')
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}booking/provider_dashboard/${providerId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log(data, 'Dashboard Details Response');

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard details');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);
export const fetchUnassignedBookings = createAsyncThunk(
  'booking/fetchUnassignedBookings',
  async (providerId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}booking/unassigned_bookings/${providerId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log(data, 'Unassigned Bookings Response');

      // 🛑 Check if it's an "error" response (even if response.ok)
      if (data.error) {
        return []; // Return empty array if no bookings
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch unassigned bookings');
      }

      return data; // Assuming it's an array of bookings
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

// export const fetchUnassignedBookings = createAsyncThunk(
//   'booking/fetchUnassignedBookings',
//   async (providerId, { rejectWithValue }) => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       const response = await fetch(`${BASE_URL}booking/unassigned_bookings/${providerId}`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Authorization': token ? `Bearer ${token}` : '',
//         },
//       });

//       const data = await response.json();
//       console.log(data, 'Unassigned Bookings Response');

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch unassigned bookings');
//       }

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message || 'Something went wrong!');
//     }
//   }
// );
export const acceptBooking = createAsyncThunk(
  'booking/acceptBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}booking/accept_booking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log(data, 'Accept Booking Response');

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept booking');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);
export const fetchBookingByFilter = createAsyncThunk(
  'booking/fetchBookingByFilter',
  async ({ providerId, filterType, searchQuery = '' }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        `${BASE_URL}booking/fetch_by_provider/${providerId}?filter_type=${filterType}&search_query=${encodeURIComponent(searchQuery)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      const data = await response.json();
      console.log(data, 'Booking Filter Response');

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);
export const createAdditionalAmount = createAsyncThunk(
  'additionalAmount/create',
  async (payload, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}additional_amount/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data, 'Create Additional Amount Response');

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create additional amount');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);

export const updateAdditionalAmount = createAsyncThunk(
  'additionalAmount/update',
  async ({ payload, additional_amount_id }, { rejectWithValue }) => {
    try {
      console.log(payload, additional_amount_id, 'update value');
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}additional_amount/update/${additional_amount_id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data, 'Update Additional Amount Response');

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update additional amount');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  }
);



export const createPaymentHistory = createAsyncThunk(
  'payment/createPaymentHistory',
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log(paymentData,'here payment dsata')

      const response = await fetch(`${BASE_URL}payment_history/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          booking_id: paymentData?.booking_id,
          transaction_id: paymentData?.transaction_id,
          description: paymentData?.description,
          payment_type: paymentData?.payment_type,
          paid_on: paymentData?.paid_on,
          amount: paymentData?.amount,
          razorpay_id: paymentData?.razorpay_id,
          additional_amount_id: paymentData?.additional_amount_id,
        }),
      });

      const data = await response.json();
      console.log('Create Payment History Response:', data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while creating payment history!');
    }
  }
);
export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log(messageData, 'Message Data');

      const response = await fetch(`${BASE_URL}messages/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          user_id: messageData?.user_id,
          provider_id: messageData?.provider_id,
          message: messageData?.message,
          is_from_user_to_provider: messageData?.is_from_user_to_provider,
          booking_id: messageData?.booking_id,
        }),
      });

      const data = await response.json();
      console.log('Create Message Response:', data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while sending the message!');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (booking_id, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Fetching messages for booking id:', booking_id);

      const response = await fetch(`${BASE_URL}messages/fetch/${booking_id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      console.log('Fetch Messages Response:', data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while fetching messages!');
    }
  }
);

export const deActivateprovider = createAsyncThunk(
  'user/deActivateprovider',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Deactive user with ID:', userId);

      const response = await fetch(`${BASE_URL}provider/deactivate/${userId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log('Deactivate Profile Response:', data);

      // Check for successful response
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete profile');
      }

      return data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while deleting the profile!');
    }
  }
);

export const Activateprovider = createAsyncThunk(
  'user/Activateprovider',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('active user with ID:', userId);

      const response = await fetch(`${BASE_URL}provider/activate/${userId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log('active Profile Response:', data);

      // Check for successful response
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete profile');
      }

      return data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong while deleting the profile!');
    }
  }
);

export const fetchAdditionalAmount = createAsyncThunk(
  'booking/fetchAdditionalAmount',
  async (bookingId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}additional_amount/fetch/${bookingId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const data = await response.json();
      console.log('Fetched Additional Amount: api', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch additional amount');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    serviceDetails: null,
    dashboardDetails: null,
    unassignedBookings:[],
    bookings: [],
    messages: [],
    additionalAmount: [],
    loadingAdditionalAmount: false,
    additionalAmountError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Logic
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Logic
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // reset
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

         // Handle FCM Token Update
         .addCase(updateFcmToken.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateFcmToken.fulfilled, (state, action) => {
          state.loading = false;
        })
        .addCase(updateFcmToken.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
         // Fetch All Service Types
      .addCase(fetchAllServiceTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = action.payload;
      })
      .addCase(fetchAllServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Service Type by ID
      .addCase(fetchServiceTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceDetails = action.payload; // You can add this field to initialState
      })
      .addCase(fetchServiceTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Addresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(fetchNotifications.pending, (state) => {
        state.loadingNotifications = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loadingNotifications = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loadingNotifications = false;
        console.log('Notification fetch error:', action.payload);
      })
  
      .addCase(fetchBookings.pending, (state) => {
        state.loadingBookings = true;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
        state.loadingBookings = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loadingBookings = false;
      })
      // .addCase(fetchBookings.pending, (state) => {
      //   state.loadingBookings = true;
      //   state.bookings = []; // clear previous data
      // })
      // .addCase(fetchBookings.fulfilled, (state, action) => {
      //   state.loadingBookings = false;
      //   state.bookings = action.payload || [];
      // })
      // .addCase(fetchBookings.rejected, (state) => {
      //   state.loadingBookings = false;
      // })

      
      .addCase(fetchCities.pending, (state) => {
        state.loadingCities = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loadingCities = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state) => {
        state.loadingCities = false;
      })

      .addCase(fetchProviderDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardDetails = action.payload;
      })
      .addCase(fetchProviderDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUnassignedBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnassignedBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.unassignedBookings = action.payload || []; // Ensure empty array is stored
      })
      .addCase(fetchUnassignedBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.acceptedBooking = action.payload;
      })
      .addCase(acceptBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchBookingByFilter.pending, (state) => {
        state.loading = true;
        state.bookings = []; // Clear on every fetch
      })
      .addCase(fetchBookingByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload || [];
      })
      .addCase(fetchBookingByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdditionalAmount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdditionalAmount.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createAdditionalAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // Add the new message to the list
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdditionalAmount.pending, (state) => {
        state.loadingAdditionalAmount = true;
        state.additionalAmountError = null;
      })
      .addCase(fetchAdditionalAmount.fulfilled, (state, action) => {
        state.loadingAdditionalAmount = false;
        state.additionalAmount = action.payload;
      })
      .addCase(fetchAdditionalAmount.rejected, (state, action) => {
        state.loadingAdditionalAmount = false;
        state.additionalAmountError = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
