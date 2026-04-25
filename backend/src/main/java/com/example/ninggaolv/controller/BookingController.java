package com.example.ninggaolv.controller;

import com.example.ninggaolv.model.Booking;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
  private final Map<String, Booking> store = new LinkedHashMap<>();

  @GetMapping
  public Map<String,Object> list(@RequestParam(required = false) String routeId,
                                 @RequestParam(required = false) String status,
                                 @RequestParam(required = false) Long start,
                                 @RequestParam(required = false) Long end,
                                 @RequestParam(defaultValue = "0") Integer page,
                                 @RequestParam(defaultValue = "20") Integer size) {
    List<Booking> all = new ArrayList<>(store.values());
    List<Booking> filtered = all.stream().filter(b ->
      (routeId == null || routeId.isEmpty() || routeId.equals(b.getRouteId())) &&
      (status == null || status.isEmpty() || status.equals(b.getStatus())) &&
      (start == null || b.getDate() >= start) &&
      (end == null || b.getDate() < end)
    ).collect(Collectors.toList());
    int from = Math.max(0, page * size);
    int to = Math.min(filtered.size(), from + size);
    List<Booking> content = from >= filtered.size() ? new ArrayList<>() : filtered.subList(from, to);
    return Map.of("content", content, "page", page, "size", size, "total", filtered.size());
  }

  @PostMapping
  public ResponseEntity<Booking> create(@RequestBody Booking req) {
    String id = req.getId() != null ? req.getId() : UUID.randomUUID().toString();
    Booking b = new Booking(id, req.getRouteId(), req.getRouteName(),
      req.getStatus() != null ? req.getStatus() : "进行中",
      req.getRating() != null ? req.getRating() : 0,
      req.getDate() != null ? req.getDate() : System.currentTimeMillis(),
      req.getSourceType(), req.getSourceId());
    store.put(id, b);
    return ResponseEntity.status(201).body(b);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Booking> update(@PathVariable String id, @RequestBody Map<String,Object> patch) {
    Booking b = store.get(id);
    if (b == null) return ResponseEntity.notFound().build();
    if (patch.containsKey("status")) b.setStatus(String.valueOf(patch.get("status")));
    if (patch.containsKey("rating")) b.setRating(Integer.valueOf(String.valueOf(patch.get("rating"))));
    store.put(id, b);
    return ResponseEntity.ok(b);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable String id) {
    store.remove(id);
    return ResponseEntity.noContent().build();
  }
}
