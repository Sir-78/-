package com.example.ninggaolv.controller;

import com.example.ninggaolv.model.Route;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
  private final List<Route> routes;

  public RouteController() {
    routes = new ArrayList<>();
    routes.add(new Route("desert_1","沙坡头星空徒步","自然风光",120,37.5,105.2,null));
    routes.add(new Route("mountain_1","贺兰山古道骑行","自然风光",98,38.5,106.3,null));
    routes.add(new Route("river_1","黄河大峡谷漂流","河流体育旅游",110,38.02,106.27,null));
    routes.add(new Route("red_1","六盘山长征精神研学","红色文化体验",75,35.96,106.29,null));
    routes.add(new Route("rural_1","北长滩古村农创体验","乡村体育旅游",66,37.9,106.2,null));
    routes.add(new Route("snow_1","贺兰山阅海滑雪挑战","冰雪体育旅游",54,38.5,106.2,null));
    routes.add(new Route("desert_2","腾格里穿越挑战","沙漠徒步",80,37.8,105.0,null));
  }

  @GetMapping
  public Map<String,Object> list(@RequestParam(required = false) String category,
                                 @RequestParam(defaultValue = "0") Integer page,
                                 @RequestParam(defaultValue = "20") Integer size) {
    List<Route> filtered = routes.stream()
      .filter(r -> category == null || category.isEmpty() || category.equals(r.getCategory()))
      .collect(Collectors.toList());
    int from = Math.max(0, page * size);
    int to = Math.min(filtered.size(), from + size);
    List<Route> content = from >= filtered.size() ? new ArrayList<>() : filtered.subList(from, to);
    return Map.of("content", content, "page", page, "size", size, "total", filtered.size());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Route> get(@PathVariable String id) {
    return routes.stream().filter(r -> r.getId().equals(id)).findFirst()
      .map(ResponseEntity::ok)
      .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
