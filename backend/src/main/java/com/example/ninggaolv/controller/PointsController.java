package com.example.ninggaolv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/points")
public class PointsController {
  private int total = 0;
  private final List<Map<String,Object>> history = new ArrayList<>();

  @GetMapping
  public Map<String,Object> overview() {
    return Map.of("total", total, "history", history);
  }

  @PostMapping("/events")
  public ResponseEntity<Void> add(@RequestBody Map<String,Object> body) {
    int delta = Integer.parseInt(String.valueOf(body.getOrDefault("delta", 0)));
    String reason = String.valueOf(body.getOrDefault("reason", ""));
    total += delta;
    history.add(Map.of("ts", System.currentTimeMillis(), "delta", delta, "reason", reason));
    return ResponseEntity.status(201).build();
  }
}
