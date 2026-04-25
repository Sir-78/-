package com.example.ninggaolv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
  private String id;
  private String type;
  private String content;
  private List<String> images;
  private Long date;
  private Integer likes;
}
