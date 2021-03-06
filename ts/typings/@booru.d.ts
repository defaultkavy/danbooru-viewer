declare module '@booru' {
    
    interface _Post {
        [key: string];
        id: number;
        created_at: Date;
        uploader_id: number;
        score: number;
        source: string;
        md5: string;
        last_comment_bumped_at?: any;
        rating: string;
        image_width: number;
        image_height: number;
        tag_string: string;
        fav_count: number;
        file_ext: 'jpg' | 'png' | 'mp4' | 'gif';
        last_noted_at?: any;
        parent_id?: any;
        has_children: boolean;
        approver_id: number;
        tag_count_general: number;
        tag_count_artist: number;
        tag_count_character: number;
        tag_count_copyright: number;
        file_size: number;
        up_score: number;
        down_score: number;
        is_pending: boolean;
        is_flagged: boolean;
        is_deleted: boolean;
        tag_count: number;
        updated_at: Date;
        is_banned: boolean;
        pixiv_id: number;
        last_commented_at?: any;
        has_active_children: boolean;
        bit_flags: number;
        tag_count_meta: number;
        has_large: boolean;
        has_visible_children: boolean;
        tag_string_general: string;
        tag_string_character: string;
        tag_string_copyright: string;
        tag_string_artist: string;
        tag_string_meta: string;
        file_url: string;
        large_file_url: string;
        preview_file_url: string;
    }

    interface _Tag {
        [key: string];
        id: number;
        name: string;
        post_count: number;
        category: number;
        created_at: string;
        updated_at: string;
        is_locked: boolean;
      }
}
