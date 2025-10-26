package diyor.adawev.backend.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaterialItemResponse {
    private Long id;
    private String materialName;      // Odam o'qiydigan nom (edit qilish mumkin)
    private Float quantity;       // Miqdor (edit qilish mumkin)
    private String unit;
    private String originalName;       // Database'dagi original nom (reference uchun)
    private String type;               // Material type (reference uchun)
}
