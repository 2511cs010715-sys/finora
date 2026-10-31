package com.finverse.repository;

import com.finverse.model.Watchlist;
import com.finverse.model.User;
import com.finverse.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUser(User user);
    List<Watchlist> findByUserId(Long userId);
    Optional<Watchlist> findByUserAndAsset(User user, Asset asset);
    Boolean existsByUserAndAsset(User user, Asset asset);
}
