import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchParcelRequest } from 'modules/parcels/actions'
import {
  getData as getParcels,
  isFetchingParcel
} from 'modules/parcels/selectors'
import { getEstates, isFetchingEstate } from 'modules/estates/selectors'
import { fetchEstateRequest } from 'modules/estates/actions'
import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'
import AssetLoader from './AssetLoader'

const mapState = (state, { id, assetType }) => {
  let isLoading = false
  let isLoaded = false
  let assets = {}
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const [x, y] = splitCoordinate(id)
      assets = getParcels(state)
      isLoaded = id in assets
      isLoading = !isLoaded && isFetchingParcel(state, x, y)
      break
    }
    case ASSET_TYPES.estate: {
      assets = getEstates(state)
      isLoaded = id in assets
      isLoading = !isLoaded && isFetchingEstate(state, id)
      break
    }
  }
  const asset = assets[id]

  return { isLoading, asset }
}

const mapDispatch = (dispatch, { id, assetType }) => {
  let onFetchAsset
  let onAccessDenied
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const [x, y] = splitCoordinate(id)
      onFetchAsset = () => dispatch(fetchParcelRequest(x, y))
      onAccessDenied = () => dispatch(push(locations.parcelDetail(x, y)))
      break
    }
    case ASSET_TYPES.estate:
      onFetchAsset = () => dispatch(fetchEstateRequest(id))
      onAccessDenied = () => dispatch(push(locations.estateDetail(id)))
      break
  }

  return { onFetchAsset, onAccessDenied }
}

export default connect(mapState, mapDispatch)(AssetLoader)
