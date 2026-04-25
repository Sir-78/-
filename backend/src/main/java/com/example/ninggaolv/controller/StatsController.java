package com.example.ninggaolv.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
  @GetMapping("/summary")
  public Map<String,Object> summary(@RequestParam(defaultValue = "month") String range,
                                    @RequestParam(required = false) Long start,
                                    @RequestParam(required = false) Long end) {
    return Map.of("totalRoutes", 20, "totalBookings", 50, "completedBookings", 30,
      "averageRating", 4.5, "totalPosts", 12, "pointsDelta", 3);
  }

  @GetMapping("/popular")
  public List<Map<String,Object>> popular(@RequestParam(defaultValue = "month") String range,
                                          @RequestParam(required = false) Long start,
                                          @RequestParam(required = false) Long end) {
    return List.of(
      Map.of("id","desert_1","name","沙坡头星空徒步","bookingCount",23,"completedCount",18,"averageRating",4.7,"viewCount",120,"score",87.5),
      Map.of("id","mountain_1","name","贺兰山古道骑行","bookingCount",19,"completedCount",15,"averageRating",4.4,"viewCount",98,"score",79.2)
    );
  }
}
