import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function AddressInput({ onSelect }) {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>


      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            onSelect({
              street: place.address_components.find(c => c.types.includes('route'))?.long_name || '',
              number: place.address_components.find(c => c.types.includes('street_number'))?.long_name || '',
              city: place.address_components.find(c => c.types.includes('locality'))?.long_name || '',
              postalCode: place.address_components.find(c => c.types.includes('postal_code'))?.long_name || '',
            });
          });
        }}
      >
        <input type="text" placeholder="Buscar dirección" style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
      </Autocomplete>
    </LoadScript>
  );
}
