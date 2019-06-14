import { onThemeChange, onShowCustomThemeView, onThemeInit } from './theme';
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular';
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending';
import { onLoadFavoriteData } from './favorite';
import { onLoadLanguage } from './language';
import {onSearch, onLoadMoreSearch, onSearchCancel} from './search';

export default {
  onThemeChange,
  onShowCustomThemeView,
  onThemeInit,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTrendingFavorite,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onLoadLanguage,
  onSearch,
  onLoadMoreSearch,
  onSearchCancel,
}