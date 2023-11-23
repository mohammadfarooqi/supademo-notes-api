import db from '../../config/database.js';
import _ from 'lodash';

class NotesService {
  async createNote(note) {
    try {
      const { title, body, userId } = note;

      const [newNote] = await db('notes')
        .insert({
          title,
          body,
          user_id: userId,
        })
        .returning('*');

      return newNote;
    } catch (error) {
      throw error;
    }
  }

  async getAllNotes({ page, pageSize, sortByDate = 'asc', whereClause }) {
    try {
      const offset = (page - 1) * pageSize;

      const totalItemsQuery = db('notes as n').count('* as total').first();
      const notesQuery = db('notes as n')
        .select([
          'n.id',
          'n.title',
          'n.body',
          'n.user_id',
          'n.created_at',
          'n.updated_at',
        ])
        .orderBy('n.updated_at', sortByDate)
        .limit(pageSize)
        .offset(offset);

      if (whereClause && whereClause.userId) {
        notesQuery.where('n.user_id', whereClause.userId);
        totalItemsQuery.where('n.user_id', whereClause.userId);
      }

      const [totalItemsResult, notes] = await Promise.all([
        totalItemsQuery,
        notesQuery,
      ]);

      const totalItems = parseInt(totalItemsResult.total);

      return {
        totalItems,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        notes,
      };
    } catch (error) {
      throw error;
    }
  }

  async getNoteById({ whereClause }) {
    try {
      const noteQuery = db('notes as n').select([
        'n.id',
        'n.title',
        'n.body',
        'n.user_id',
        'n.created_at',
        'n.updated_at',
      ]);

      if (whereClause && whereClause.userId) {
        noteQuery.where('n.user_id', whereClause.userId);
      }

      if (whereClause && whereClause.id) {
        noteQuery.where('n.id', whereClause.id);
      }

      const note = await noteQuery.first();
      return note;
    } catch (error) {
      throw error;
    }
  }

  async updateNote({ id, note, userId }) {
    try {
      const [updatedNote] = await db('notes')
        .where({ id, user_id: userId })
        .update(note)
        .returning('*');

      if (!updatedNote) {
        throw new Error('NOTE_NOT_FOUND');
      }

      return updatedNote;
    } catch (error) {
      throw error;
    }
  }

  async deleteNote({ id, userId }) {
    try {
      const result = await db('notes').where({ id, user_id: userId }).del();

      if (result === 0) {
        throw new Error('NOTE_NOT_FOUND');
      }

      return 'Note deleted successfully';
    } catch (error) {
      throw error;
    }
  }
}

export default new NotesService();
